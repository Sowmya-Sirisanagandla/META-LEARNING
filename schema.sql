--
-- PostgreSQL database dump
--

\restrict Xr90TmgUBKeA5s0OTVS1fyexxNjKQsm8qhnR3zreEOCirWudozcOv9d5O7RXW86

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-10 18:08:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    experience integer,
    subject text,
    created_at timestamp without time zone DEFAULT now(),
    specialization character varying(100),
    license_number text,
    hospital_name text,
    years_experience integer,
    two_factor_enabled boolean DEFAULT false,
    otp character varying(10),
    otp_expiry timestamp without time zone
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 219
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- TOC entry 222 (class 1259 OID 16407)
-- Name: patients; Type: TABLE; Schema: public; Owner: metabridge_user
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    created_at timestamp without time zone DEFAULT now(),
    first_name text,
    last_name text,
    date_of_birth date,
    emergency_contact text,
    emergency_phone text,
    two_factor_enabled boolean DEFAULT false,
    otp text,
    otp_expiry timestamp without time zone
);


ALTER TABLE public.patients OWNER TO metabridge_user;

--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: metabridge_user
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO metabridge_user;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 221
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metabridge_user
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- TOC entry 224 (class 1259 OID 16423)
-- Name: predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predictions (
    id integer NOT NULL,
    user_id integer,
    user_type text,
    model_type text,
    input_data jsonb,
    prediction_result jsonb,
    predicted_at timestamp without time zone DEFAULT now(),
    CONSTRAINT predictions_user_type_check CHECK ((user_type = ANY (ARRAY['doctor'::text, 'patient'::text])))
);


ALTER TABLE public.predictions OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16422)
-- Name: predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.predictions_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 223
-- Name: predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.predictions_id_seq OWNED BY public.predictions.id;


--
-- TOC entry 4867 (class 2604 OID 16394)
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- TOC entry 4870 (class 2604 OID 16410)
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: metabridge_user
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 16426)
-- Name: predictions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions ALTER COLUMN id SET DEFAULT nextval('public.predictions_id_seq'::regclass);


--
-- TOC entry 4877 (class 2606 OID 16405)
-- Name: doctors doctors_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_email_key UNIQUE (email);


--
-- TOC entry 4879 (class 2606 OID 16403)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 16421)
-- Name: patients patients_email_key; Type: CONSTRAINT; Schema: public; Owner: metabridge_user
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_email_key UNIQUE (email);


--
-- TOC entry 4883 (class 2606 OID 16419)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: metabridge_user
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16433)
-- Name: predictions predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO metabridge_user;


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE doctors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.doctors TO metabridge_user;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 219
-- Name: SEQUENCE doctors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.doctors_id_seq TO metabridge_user;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE predictions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.predictions TO metabridge_user;


--
-- TOC entry 2062 (class 826 OID 16434)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO metabridge_user;


-- Completed on 2025-12-10 18:08:54

--
-- PostgreSQL database dump complete
--

\unrestrict Xr90TmgUBKeA5s0OTVS1fyexxNjKQsm8qhnR3zreEOCirWudozcOv9d5O7RXW86

