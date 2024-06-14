--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-06-11 09:05:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 32934)
-- Name: Naselja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Naselja" (
    "ID" integer NOT NULL,
    "Naziv" text,
    "OpćinaKey" integer,
    "ŽupanijaKey" integer
);


ALTER TABLE public."Naselja" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32922)
-- Name: Općine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Općine" (
    "ID" integer NOT NULL,
    "Naziv" text,
    "ŽupanijaKey" integer
);


ALTER TABLE public."Općine" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 32952)
-- Name: Polja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Polja" (
    "ID" integer NOT NULL,
    "RecordID" integer,
    "Vrhovi" text,
    "Operacija" text,
    "Opis" text,
    "Color" text
);


ALTER TABLE public."Polja" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32951)
-- Name: Polja_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Polja_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Polja_ID_seq" OWNER TO postgres;

--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 221
-- Name: Polja_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Polja_ID_seq" OWNED BY public."Polja"."ID";


--
-- TOC entry 217 (class 1259 OID 32903)
-- Name: Zapisnici; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Zapisnici" (
    "ID" integer NOT NULL,
    "GKZona" integer,
    "GKN" integer,
    "GKE" integer,
    "UNSektor" text,
    "OznakaUN" integer,
    "Oznaka" text,
    "Županija" text,
    "Općina" text,
    "Naselje" text,
    "VojskaID" text,
    "Datum" text,
    "POM" integer,
    "PPM" integer,
    "Ostala" integer,
    "Provjere" integer,
    "TipPolja" text
);


ALTER TABLE public."Zapisnici" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 32896)
-- Name: ŠifarnikBoja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ŠifarnikBoja" (
    "TipPolja" text NOT NULL,
    "Color" text
);


ALTER TABLE public."ŠifarnikBoja" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 32915)
-- Name: Županije; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Županije" (
    "ID" integer NOT NULL,
    "Naziv" text,
    "Kratica" text
);


ALTER TABLE public."Županije" OWNER TO postgres;

--
-- TOC entry 4655 (class 2604 OID 32955)
-- Name: Polja ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Polja" ALTER COLUMN "ID" SET DEFAULT nextval('public."Polja_ID_seq"'::regclass);


--
-- TOC entry 4820 (class 0 OID 32934)
-- Dependencies: 220
-- Data for Name: Naselja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Naselja" ("ID", "Naziv", "OpćinaKey", "ŽupanijaKey") FROM stdin;
\.


--
-- TOC entry 4819 (class 0 OID 32922)
-- Dependencies: 219
-- Data for Name: Općine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Općine" ("ID", "Naziv", "ŽupanijaKey") FROM stdin;
\.


--
-- TOC entry 4822 (class 0 OID 32952)
-- Dependencies: 222
-- Data for Name: Polja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Polja" ("ID", "RecordID", "Vrhovi", "Operacija", "Opis", "Color") FROM stdin;
\.


--
-- TOC entry 4817 (class 0 OID 32903)
-- Dependencies: 217
-- Data for Name: Zapisnici; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Zapisnici" ("ID", "GKZona", "GKN", "GKE", "UNSektor", "OznakaUN", "Oznaka", "Županija", "Općina", "Naselje", "VojskaID", "Datum", "POM", "PPM", "Ostala", "Provjere", "TipPolja") FROM stdin;
31131	5	5028710	610645	N	1702	104	SM			ARSK	5/31/1992	0	32	0	1	PPM
31132	5	5028710	610645	N	1702	66/3	SM	Sunja	Sunja	ARSK	5/31/1992	0	32	0	1	PPM
31816	5	5030175	610700	N	2265	50	SM			HV	05/01/1995	8	0	0	0	POM
33238	5	5028200	610800	N	1700	bb	SM			JA	5/31/1995	0	32	0	0	PPM
31040	5	5029096	610844	N	1626	66	SM	SISAK	Sisak	ARSK	11/23/1991	16	21	0	1	MIX
31190	5	5028900	610900	N	1737	62	SM	Sunja	Sunja	ARSK	06/07/1992	0	11	0	0	PPM
31191	5	5028900	610900	N	1737	255	SM			ARSK	06/07/1992	0	11	0	0	PPM
30960	5	5029200	611000	N	1493		SM	SISAK	Sisak	JA	11/27/1991	0	16	0	0	PPM
31814	5	5029600	611300	N	2263	4	SM			HV	05/06/1995	0	7	0	0	PPM
32975	5	5029600	611300		0	77	SM	SISAK	Sisak	HV	05/06/1995	0	7	0	0	PPM
30976	5	5028440	611330	N	1505		SM	Sunja	Sunja	JA	11/17/1991	0	11	0	0	PPM
30706	5	5028460	611360	N	1444	130	SM	Sunja	Blinjska Greda	JA	11/27/1991	0	1	0	0	PPM
30707	5	5028450	611360	N	1444	31	SM	SISAK	Sisak	JA	11/27/1991	0	1	0	0	PPM
30977	5	5028440	611380	N	1505	129	SM	Sunja	Blinjska Greda	JA	11/17/1991	0	11	0	0	PPM
31813	5	5029480	611460	N	2262		SM			HV	05/05/1995	0	5	0	0	PPM
32976	5	5029480	611460		0	78	SM	SISAK	Sisak	HV	05/05/1995	0	5	0	0	PPM
31146	5	5029299	611901	N	1709	128	SM	Sunja	Blinjska Greda	ARSK	3/28/1993	0	40	0	1	PPM
30520	5	5030000	612000	N	1140	160	SM	SISAK	Klobu_ak	HV	3/28/1992	0	8	0	0	PPM
30521	5	5030000	612000	N	1140	19	SM	SISAK	Sisak	HV	3/28/1992	0	8	0	0	PPM
30543	5	5030000	612000	N	1155	125	SM	SISAK	Klobu_ak	HV	3/28/1992	0	18	0	0	PPM
30544	5	5030000	612000	N	1155	23	SM	SISAK	Sisak	HV	3/28/1992	0	18	0	0	PPM
32996	5	5030220	612060		0	134	SM			HV	4/19/1994	0	10	0	0	PPM
31154	5	5029840	612132	N	1714		SM	Sunja	Sunja	ARSK	4/18/1993	0	31	0	0	PPM
30972	5	5028800	612240	N	1503	132	SM	Sunja	Bestrma	JA	11/27/1991	0	17	0	0	PPM
30973	5	5028800	612240	N	1503		SM	Sunja	Sunja	JA	11/27/1991	0	17	0	0	PPM
31094	5	5028704	612268	N	1675	139	SM	Sunja	Blinjska Greda	JA	11/27/1991	0	0	5	1	MIX
32997	5	5030400	612340		0	135	SM			HV	11/08/1994	0	8	0	0	PPM
31142	5	5028800	612392	N	1707	140	SM	Sunja	Bestrma	JA	06/01/1992	0	4	0	0	PPM
31099	5	5028640	612560	N	1678	49	SM	SISAK	Sisak	JA	11/27/1991	0	5	0	0	PPM
30967	5	5028676	612563	N	1499	137	SM	Sunja	Blinjska Greda	ARSK	11/28/1991	0	5	0	1	PPM
31139	5	5028800	612600	N	1706	143	SM	Sunja	Bestrma	ARSK	5/30/1992	0	3	0	0	PPM
31140	5	5028800	612600	N	1706	58	SM	Sunja	Sunja	ARSK	3/17/1992	0	3	0	0	PPM
31135	5	5028600	612700	N	1704	54	SM	Sunja	Sunja	ARSK	5/31/1992	0	18	0	0	PPM
31136	5	5028600	612700	N	1704	144	SM	Sunja	Bestrma	ARSK	5/31/1992	0	18	0	0	PPM
31138	5	5028600	612700	N	1705	145	SM	Sunja	Bestrma	ARSK	06/05/1992	10	0	0	0	POM
31141	5	5028800	612800	N	1707	53	SM	Sunja	Sunja	ARSK	5/31/1992	0	4	0	0	PPM
30968	5	5028620	612840	N	1500		SM	Sunja	Sunja	JA	11/26/1991	0	7	0	0	PPM
30969	5	5028620	612840	N	1500	133	SM	Sunja	Blinjska Greda	ARSK	12/02/1991	0	4	3	0	PPM
31098	5	5028620	612840	N	1677	50	SM	SISAK	Sisak	JA	11/26/1991	0	7	0	0	PPM
30511	5	5030000	613000	N	1135	80	SM	SISAK	Klobu_ak	HV	03/12/1992	0	6	0	0	PPM
30512	5	5030000	613000	N	1135	11	SM	SISAK	Sisak	HV	03/12/1992	0	14	0	0	PPM
30519	5	5029000	613000	N	1139	18	SM	SISAK	Sisak	HV	3/28/1992	0	17	0	0	PPM
30535	5	5030000	613000	N	1149	87	SM	SISAK	Klobu_ak	HV	03/12/1992	0	13	0	0	PPM
30536	5	5030000	613000	N	1149	12	SM	SISAK	Sisak	HV	03/12/1992	0	13	0	0	PPM
30537	5	5030000	613000	N	1150	13	SM	SISAK	Sisak	HV	3/16/1992	0	20	0	0	PPM
30538	5	5030000	613000	N	1150	93	SM	SISAK	Klobu_ak	HV	3/16/1992	0	20	0	0	PPM
30925	5	5029000	613000	N	1126	16	SM	SISAK	Sisak	HV	3/28/1992	0	14	0	0	PPM
30926	5	5029000	613000	N	1127	159	SM	SISAK	Klobu_ak	HV	3/28/1992	0	30	0	0	PPM
30927	5	5029000	613000	N	1127	17	SM	SISAK	Sisak	HV	3/28/1992	0	30	0	0	PPM
31025	5	5029000	613000	N	1612	81	SM	SISAK	Klobu_ak	HV	3/28/1992	0	14	0	0	PPM
31026	5	5029000	613000	N	1612	12	SM	SISAK	Sisak	HV	3/28/1992	0	14	0	0	PPM
31147	5	5029700	613000	N	1710		SM	Sunja	Sunja	ARSK	3/24/1993	1	21	0	0	MIX
32938	5	5028700	613000		0	59	SM	Sunja	Bestrma		01/03/1992	2	8	0	0	MIX
33235	5	5029000	613000	N	1613	82	SM	SISAK	Klobu_ak	HV	3/28/1992	0	17	0	0	PPM
33236	5	5029000	613000	N	1614	89	SM	SISAK	Klobu_ak	HV	3/28/1992	0	30	0	0	PPM
31787	5	5028625	613017	N	2246	142	SM			ARSK	04/01/1993	3	31	0	0	MIX
31153	5	5029394	613367	N	1713	360	SM	Sunja	Bestrma	ARSK	3/24/1993	0	5	0	0	PPM
31148	5	5029800	613400	N	1711		SM	Sunja	Sunja		4/24/1993	0	12	0	0	PPM
31149	5	5029800	613400	N	1711	141	SM			ARSK	4/24/1993	0	11	0	0	PPM
31788	5	5029650	613425	N	2246		SM	SISAK	Sisak	ARSK	04/01/1993	3	33	0	0	MIX
31038	5	5029400	613500	N	1624	33	SM	SISAK	Sisak	JA	08/01/1991	0	72	0	0	PPM
32860	5	5029400	613500		0	138	SM	Sunja	Bestrma	ARSK	08/01/1991	0	12	0	0	PPM
31144	5	5029102	613600	N	1708	134	SM			ARSK	06/10/1992	2	5	0	1	MIX
31152	5	5030420	613775	N	1713		SM	Sunja	Sunja	ARSK	3/24/1993	0	5	0	0	PPM
31802	5	5030175	614025	N	2255		SM	SISAK	Sisak	ARSK	4/24/1993	0	12	0	0	PPM
31150	5	5029302	614135	N	1712	155	SM			ARSK	06/03/1992	3	8	0	1	MIX
31815	5	5031250	614175	N	2264	49	SM			HV	05/01/1995	8	0	0	0	POM
31039	5	5029200	614200	N	1625	34	SM	SISAK	Sisak	JA	08/01/1991	0	12	0	0	PPM
32862	5	5029200	614200		0	154	SM	Sunja	Bestrma	JA	unknown	0	12	0	0	PPM
31165	5	5030308	614289	N	1720	176	SM	SISAK	Blinjski Kut	ARSK	04/06/1993	0	25	0	1	PPM
31166	5	5030308	614289	N	1720		SM	Sunja	Sunja	ARSK	04/06/1993	0	24	0	1	PPM
31164	5	5030280	614300	N	1719		SM	Sunja	Sunja	ARSK	04/10/1993	0	26	0	0	PPM
31167	5	5030375	614375	N	1721	177	SM	SISAK	Blinjski Kut	ARSK	04/08/1993	0	21	1	1	PPM
31168	5	5030375	614375	N	1721		SM	Sunja	Sunja	ARSK	04/08/1993	0	22	0	1	PPM
31133	5	5029300	614400	N	1703	55	SM	Sunja	Sunja	ARSK	06/02/1992	0	25	0	0	PPM
31134	5	5029300	614400	N	1703	153	SM	Sunja	Blinjska Greda	ARSK	06/02/1992	0	25	0	0	PPM
31157	5	5030900	614500	N	1715	178	SM	SISAK	Blinjski Kut	ARSK	10/21/1993	177	49	0	0	MIX
33021	5	5030000	614500		0	161	SM	SISAK	Blinjski Kut	HV	03/11/1992	12	4	0	0	MIX
31162	5	5030900	614550	N	1718	10	SM	Sunja	Sunja	ARSK	4/14/1993	28	4	0	0	MIX
31163	5	5030900	614550	N	1718	175	SM	SISAK	Blinjski Kut	ARSK	4/14/1993	28	0	4	0	POM
30922	5	5031000	614600	N	1124	192	SM	SISAK	Blinjski Kut	ARSK	08/01/1991	0	4	0	0	PPM
30923	5	5031000	614600	N	1124	36	SM	SISAK	Sisak	JA	08/01/1991	0	4	0	0	PPM
30980	5	5031000	614600	N	1512		SM	SISAK	Sisak	JA	08/01/1991	0	4	0	0	PPM
31169	5	5030115	614607	N	1722	173	SM	SISAK	Blinjski Kut	ARSK	3/16/1993	0	6	0	1	PPM
31170	5	5030115	614607	N	1722	9	SM			ARSK	3/16/1993	0	6	0	1	PPM
31803	5	5030750	614650	N	2256		SM	SISAK	Sisak	ARSK	11/03/1993	290	0	0	0	POM
31817	5	5031400	614650	N	2266		SM	PETRINJA	Blinja	HV	05/02/1995	0	9	0	0	PPM
33024	5	5031400	614650		0	164	SM	SISAK	Blinjski Kut	HV	05/02/1995	0	9	0	0	PPM
31171	5	5030087	614658	N	1723	174	SM	SISAK	Blinjski Kut	ARSK	3/15/1993	0	22	1	1	PPM
31172	5	5030087	614658	N	1723	8	SM			ARSK	3/15/1993	0	23	0	1	PPM
31156	5	5030800	614675	N	1715		SM	Sunja	Sunja	ARSK	10/21/1993	177	49	0	0	MIX
123	5	123	123	N	1702	123	SM	SISAK	Sunja	ARSK	06/22/2024	0	3	3	1	MIX
\.


--
-- TOC entry 4816 (class 0 OID 32896)
-- Dependencies: 216
-- Data for Name: ŠifarnikBoja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ŠifarnikBoja" ("TipPolja", "Color") FROM stdin;
PPM	#f505dd
POM	#fc7303
MIX	#b02709
\.


--
-- TOC entry 4818 (class 0 OID 32915)
-- Dependencies: 218
-- Data for Name: Županije; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Županije" ("ID", "Naziv", "Kratica") FROM stdin;
1	Međimurska	MM
2	Virovitičko-Podravksa	VP
3	Koprivničko-Križevačka	KK
4	Osječko-Baranjska	OB
5	Istarska	IS
6	Dubrovačko-Neretvanska	DN
7	Sisačko-Moslavačka	SM
8	Brodsko-Posavska	BP
9	Karlovačka	KR
10	Zadarska	ZD
11	Vukovarsko-Srijemska	VS
12	Splitsko-Dalmatinska	SD
13	Varaždinska	VŽ
14	Krapinsko-Zagorska	KZ
15	Zagrebačka	ZG
16	Primorsko-Goranska	PG
17	Šibensko-Kninska	ŠK
18	Ličko-Senjska	LS
19	Međimurska	BB
20	Grad Zagreb	GZ
21	Požeško-Slavonska	PS
\.


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 221
-- Name: Polja_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Polja_ID_seq"', 8, true);


--
-- TOC entry 4665 (class 2606 OID 32940)
-- Name: Naselja Naselja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Naselja"
    ADD CONSTRAINT "Naselja_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4663 (class 2606 OID 32928)
-- Name: Općine Općine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Općine"
    ADD CONSTRAINT "Općine_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4667 (class 2606 OID 32959)
-- Name: Polja Polja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Polja"
    ADD CONSTRAINT "Polja_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4659 (class 2606 OID 32909)
-- Name: Zapisnici Zapisnici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zapisnici"
    ADD CONSTRAINT "Zapisnici_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4657 (class 2606 OID 32902)
-- Name: ŠifarnikBoja ŠifarnikBoja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ŠifarnikBoja"
    ADD CONSTRAINT "ŠifarnikBoja_pkey" PRIMARY KEY ("TipPolja");


--
-- TOC entry 4661 (class 2606 OID 32921)
-- Name: Županije Županije_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Županije"
    ADD CONSTRAINT "Županije_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4670 (class 2606 OID 32941)
-- Name: Naselja Naselja_OpćinaKey_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Naselja"
    ADD CONSTRAINT "Naselja_OpćinaKey_fkey" FOREIGN KEY ("OpćinaKey") REFERENCES public."Općine"("ID");


--
-- TOC entry 4671 (class 2606 OID 32946)
-- Name: Naselja Naselja_ŽupanijaKey_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Naselja"
    ADD CONSTRAINT "Naselja_ŽupanijaKey_fkey" FOREIGN KEY ("ŽupanijaKey") REFERENCES public."Županije"("ID");


--
-- TOC entry 4669 (class 2606 OID 32929)
-- Name: Općine Općine_ŽupanijaKey_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Općine"
    ADD CONSTRAINT "Općine_ŽupanijaKey_fkey" FOREIGN KEY ("ŽupanijaKey") REFERENCES public."Županije"("ID");


--
-- TOC entry 4672 (class 2606 OID 32960)
-- Name: Polja Polja_RecordID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Polja"
    ADD CONSTRAINT "Polja_RecordID_fkey" FOREIGN KEY ("RecordID") REFERENCES public."Zapisnici"("ID");


--
-- TOC entry 4668 (class 2606 OID 32910)
-- Name: Zapisnici Zapisnici_TipPolja_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zapisnici"
    ADD CONSTRAINT "Zapisnici_TipPolja_fkey" FOREIGN KEY ("TipPolja") REFERENCES public."ŠifarnikBoja"("TipPolja");


-- Completed on 2024-06-11 09:05:11

--
-- PostgreSQL database dump complete
--

