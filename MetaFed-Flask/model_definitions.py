import torch
import torch.nn as nn
import torch.nn.functional as F

GRU_HIDDEN = 128
GRU_LAYERS = 1
TRANS_DMODEL = 128
TRANS_NHEAD = 4
TRANS_LAYERS = 2
DROPOUT = 0.25
HEART_HIDDEN = [128, 64]
DIAB_HEAD_HIDDEN = 64
DIAB_SEQ_IN = 30

class HybridGRUTransformerMTL(nn.Module):
    def __init__(self, heart_feat_dim):
        super().__init__()
        self.gru = nn.GRU(input_size=1, hidden_size=GRU_HIDDEN, num_layers=GRU_LAYERS,
                          batch_first=True, bidirectional=True)

        self.proj = nn.Linear(GRU_HIDDEN * 2, TRANS_DMODEL)
        enc = nn.TransformerEncoderLayer(d_model=TRANS_DMODEL, nhead=TRANS_NHEAD,
                                         dim_feedforward=TRANS_DMODEL*2, batch_first=True, dropout=DROPOUT)
        self.transformer = nn.TransformerEncoder(enc, num_layers=TRANS_LAYERS)
        self.seq_norm = nn.LayerNorm(TRANS_DMODEL)

        self.heart_mlp = nn.Sequential(
            nn.Linear(heart_feat_dim, HEART_HIDDEN[0]),
            nn.BatchNorm1d(HEART_HIDDEN[0]),
            nn.ReLU(),
            nn.Dropout(DROPOUT),
            nn.Linear(HEART_HIDDEN[0], HEART_HIDDEN[1]),
            nn.BatchNorm1d(HEART_HIDDEN[1]),
            nn.ReLU(),
        )

        fused = HEART_HIDDEN[1] + TRANS_DMODEL
        self.combined_proj = nn.Sequential(
            nn.Linear(fused, fused // 2),
            nn.ReLU()
        )

        self.heart_head = nn.Sequential(
            nn.Linear(fused // 2, 64),
            nn.ReLU(),
            nn.Dropout(DROPOUT),
            nn.Linear(64, 5)
        )

        self.diab_head = nn.Sequential(
            nn.Linear(TRANS_DMODEL, DIAB_HEAD_HIDDEN),
            nn.ReLU(),
            nn.Dropout(DROPOUT),
            nn.Linear(DIAB_HEAD_HIDDEN, 3)
        )

    def forward(self, heart_x, diab_x):
        g, _ = self.gru(diab_x)
        p = self.proj(g)
        t = self.transformer(p)
        t = self.seq_norm(t)
        diab_emb = t[:, -1, :]
        diab_logits = self.diab_head(diab_emb)

        heart_feat = self.heart_mlp(heart_x)
        if heart_x.size(0) == diab_x.size(0):
            context = diab_emb
        else:
            context = diab_emb.mean(dim=0, keepdim=True).expand(heart_x.size(0), -1)

        fused = torch.cat([heart_feat, context], dim=-1)
        z = self.combined_proj(fused)
        heart_logits = self.heart_head(z)

        return heart_logits, diab_logits
