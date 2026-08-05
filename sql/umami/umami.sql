--
-- PostgreSQL database dump
--

\restrict JED3TFbHKKjIZCLaR6y1IMcciRlEZbeB5E8kndfNlCWupgKvHLhwKp8KvzKbeGJ

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: event_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_data (
    event_data_id uuid NOT NULL,
    website_id uuid NOT NULL,
    website_event_id uuid NOT NULL,
    data_key character varying(500) NOT NULL,
    string_value character varying(500),
    number_value numeric(19,4),
    date_value timestamp(6) with time zone,
    data_type integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.link (
    link_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    url character varying(500) NOT NULL,
    slug character varying(100) NOT NULL,
    user_id uuid,
    team_id uuid,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone
);


--
-- Name: pixel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pixel (
    pixel_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    user_id uuid,
    team_id uuid,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone
);


--
-- Name: report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report (
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    website_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(500) NOT NULL,
    parameters jsonb NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone
);


--
-- Name: revenue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revenue (
    revenue_id uuid NOT NULL,
    website_id uuid NOT NULL,
    session_id uuid NOT NULL,
    event_id uuid NOT NULL,
    event_name character varying(50) NOT NULL,
    currency character varying(10) NOT NULL,
    revenue numeric(19,4),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: segment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.segment (
    segment_id uuid NOT NULL,
    website_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    parameters jsonb NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    session_id uuid NOT NULL,
    website_id uuid NOT NULL,
    browser character varying(20),
    os character varying(20),
    device character varying(20),
    screen character varying(11),
    language character varying(35),
    country character(2),
    region character varying(20),
    city character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    distinct_id character varying(50)
);


--
-- Name: session_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_data (
    session_data_id uuid NOT NULL,
    website_id uuid NOT NULL,
    session_id uuid NOT NULL,
    data_key character varying(500) NOT NULL,
    string_value character varying(500),
    number_value numeric(19,4),
    date_value timestamp(6) with time zone,
    data_type integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    distinct_id character varying(50)
);


--
-- Name: team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team (
    team_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    access_code character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    logo_url character varying(2183)
);


--
-- Name: team_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_user (
    team_user_id uuid NOT NULL,
    team_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    user_id uuid NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(60) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    display_name character varying(255),
    logo_url character varying(2183)
);


--
-- Name: website; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.website (
    website_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    domain character varying(500),
    share_id character varying(50),
    reset_at timestamp(6) with time zone,
    user_id uuid,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone,
    deleted_at timestamp(6) with time zone,
    created_by uuid,
    team_id uuid
);


--
-- Name: website_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.website_event (
    event_id uuid NOT NULL,
    website_id uuid NOT NULL,
    session_id uuid NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    url_path character varying(500) NOT NULL,
    url_query character varying(500),
    referrer_path character varying(500),
    referrer_query character varying(500),
    referrer_domain character varying(500),
    page_title character varying(500),
    event_type integer DEFAULT 1 NOT NULL,
    event_name character varying(50),
    visit_id uuid NOT NULL,
    tag character varying(50),
    fbclid character varying(255),
    gclid character varying(255),
    li_fat_id character varying(255),
    msclkid character varying(255),
    ttclid character varying(255),
    twclid character varying(255),
    utm_campaign character varying(255),
    utm_content character varying(255),
    utm_medium character varying(255),
    utm_source character varying(255),
    utm_term character varying(255),
    hostname character varying(100)
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7d7c822f-f926-4f97-9eda-2bdfb0c1d34e	65f0f9ee4a3b432e7fa917795033254887497a849d95acf7d9cb4ff24b45f98f	2026-08-05 19:02:39.588997+00	01_init	\N	\N	2026-08-05 19:02:39.287006+00	1
71fcfc35-1ac8-488d-811a-e822b51ec592	4cc3c14482cb8700574cbdbdb478a93ccd1cabb0aeed37dfffb77a80278ce575	2026-08-05 19:02:39.68813+00	02_report_schema_session_data	\N	\N	2026-08-05 19:02:39.594172+00	1
3528e270-1337-418f-939a-909c495f8ede	baf86a7adc077bc46ea646d86aabc5f613aeb311e63894366979a18f6a9ca48c	2026-08-05 19:02:39.825463+00	03_metric_performance_index	\N	\N	2026-08-05 19:02:39.692825+00	1
9f323e32-a523-49ad-8ced-869ee631251c	eb0e4ae2ef5204bc67ddb248358a402cd3bd88567d710f808f16c5124e5fd9cb	2026-08-05 19:02:39.874985+00	04_team_redesign	\N	\N	2026-08-05 19:02:39.828978+00	1
1bb6dfdd-6008-4179-9d9a-dfcd93f7b080	12e5b277e41da871b0768118937cef221c4d4f9c3206b719fffba86324df7a11	2026-08-05 19:02:39.916869+00	05_add_visit_id	\N	\N	2026-08-05 19:02:39.882984+00	1
a81f0feb-064e-458b-a316-603f0953d2cb	fcd8585d077229bb2a16ae4705a79a5bc31cf6cbca089de99f4b1c19cb0a0a17	2026-08-05 19:02:39.961786+00	06_session_data	\N	\N	2026-08-05 19:02:39.920906+00	1
c2364a3f-8a23-4ff0-844f-98095f9d2068	c38c9605d759b3b00f94076c929b6081d7dbd01a25d2955909fc8d1a6e3276b4	2026-08-05 19:02:39.989977+00	07_add_tag	\N	\N	2026-08-05 19:02:39.966093+00	1
58df127b-4df1-4cbb-862e-3a4ddab1b0c5	ad640f709cd22434c088d577a2cf124c275fe3dc53ca249a542ae05af66b07b6	2026-08-05 19:02:40.007711+00	08_add_utm_clid	\N	\N	2026-08-05 19:02:39.993159+00	1
88f31d8f-8cd5-4059-8628-3436670d74a3	e94d9993b17ac5c330ae3f872fd5869fb8095a3f3a7d31d2aaade73dc45fbe9c	2026-08-05 19:02:40.043942+00	09_update_hostname_region	\N	\N	2026-08-05 19:02:40.012331+00	1
d5a959a2-0e4b-4f5e-b918-b9ce5b309111	6ece5066ccec715ca8a07b65eafde7f96d110c0638b2d2187398fd1a79770ff6	2026-08-05 19:02:40.060692+00	10_add_distinct_id	\N	\N	2026-08-05 19:02:40.047866+00	1
e5db4d90-73af-4581-9bbc-0cf96655d558	e7421573e8b15f8a5c3e0928f1564ab43b3855d7c6634a36d87ece68196900e5	2026-08-05 19:02:40.101094+00	11_add_segment	\N	\N	2026-08-05 19:02:40.064589+00	1
8ca37493-86b3-415d-98e1-2f8628570d0b	f74b307b6e62c8457f32c4bae0beb99e26eb384467755912714abdfeae9e09af	2026-08-05 19:02:40.169852+00	12_update_report_parameter	\N	\N	2026-08-05 19:02:40.10469+00	1
c33689eb-83f7-4ae4-ab69-fcd2c667e780	53180616f450ac033a60143ff9b7c3656205947809c7979a51991922e7f326ad	2026-08-05 19:02:40.236234+00	13_add_revenue	\N	\N	2026-08-05 19:02:40.174464+00	1
36d41956-2aed-4d84-a8be-abf6e144937b	2017fc23cad1365fa62fe1c18b70c631eb6a119a902f88672ffad63f90d80f3d	2026-08-05 19:02:40.594145+00	14_add_link_and_pixel	\N	\N	2026-08-05 19:02:40.240375+00	1
\.


--
-- Data for Name: event_data; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_data (event_data_id, website_id, website_event_id, data_key, string_value, number_value, date_value, data_type, created_at) FROM stdin;
\.


--
-- Data for Name: link; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.link (link_id, name, url, slug, user_id, team_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: pixel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pixel (pixel_id, name, slug, user_id, team_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report (report_id, user_id, website_id, type, name, description, parameters, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: revenue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revenue (revenue_id, website_id, session_id, event_id, event_name, currency, revenue, created_at) FROM stdin;
\.


--
-- Data for Name: segment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.segment (segment_id, website_id, type, name, parameters, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (session_id, website_id, browser, os, device, screen, language, country, region, city, created_at, distinct_id) FROM stdin;
\.


--
-- Data for Name: session_data; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session_data (session_data_id, website_id, session_id, data_key, string_value, number_value, date_value, data_type, created_at, distinct_id) FROM stdin;
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team (team_id, name, access_code, created_at, updated_at, deleted_at, logo_url) FROM stdin;
\.


--
-- Data for Name: team_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_user (team_user_id, team_id, user_id, role, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (user_id, username, password, role, created_at, updated_at, deleted_at, display_name, logo_url) FROM stdin;
41e2b680-648e-4b09-bcd7-3e2b10c06264	admin	$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa	admin	2026-08-05 19:02:39.292643+00	\N	\N	\N	\N
\.


--
-- Data for Name: website; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.website (website_id, name, domain, share_id, reset_at, user_id, created_at, updated_at, deleted_at, created_by, team_id) FROM stdin;
487dccd0-5a51-4ffa-9eda-83edf75fc39d	live	localhost	\N	\N	41e2b680-648e-4b09-bcd7-3e2b10c06264	2026-08-05 19:04:38.409+00	2026-08-05 19:04:38.409+00	\N	41e2b680-648e-4b09-bcd7-3e2b10c06264	\N
\.


--
-- Data for Name: website_event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.website_event (event_id, website_id, session_id, created_at, url_path, url_query, referrer_path, referrer_query, referrer_domain, page_title, event_type, event_name, visit_id, tag, fbclid, gclid, li_fat_id, msclkid, ttclid, twclid, utm_campaign, utm_content, utm_medium, utm_source, utm_term, hostname) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: event_data event_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_data
    ADD CONSTRAINT event_data_pkey PRIMARY KEY (event_data_id);


--
-- Name: link link_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT link_pkey PRIMARY KEY (link_id);


--
-- Name: pixel pixel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pixel
    ADD CONSTRAINT pixel_pkey PRIMARY KEY (pixel_id);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (report_id);


--
-- Name: revenue revenue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue
    ADD CONSTRAINT revenue_pkey PRIMARY KEY (revenue_id);


--
-- Name: segment segment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.segment
    ADD CONSTRAINT segment_pkey PRIMARY KEY (segment_id);


--
-- Name: session_data session_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_data
    ADD CONSTRAINT session_data_pkey PRIMARY KEY (session_data_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- Name: team_user team_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_user
    ADD CONSTRAINT team_user_pkey PRIMARY KEY (team_user_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: website_event website_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.website_event
    ADD CONSTRAINT website_event_pkey PRIMARY KEY (event_id);


--
-- Name: website website_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (website_id);


--
-- Name: event_data_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_data_created_at_idx ON public.event_data USING btree (created_at);


--
-- Name: event_data_website_event_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_data_website_event_id_idx ON public.event_data USING btree (website_event_id);


--
-- Name: event_data_website_id_created_at_data_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_data_website_id_created_at_data_key_idx ON public.event_data USING btree (website_id, created_at, data_key);


--
-- Name: event_data_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_data_website_id_created_at_idx ON public.event_data USING btree (website_id, created_at);


--
-- Name: event_data_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_data_website_id_idx ON public.event_data USING btree (website_id);


--
-- Name: link_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX link_created_at_idx ON public.link USING btree (created_at);


--
-- Name: link_link_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX link_link_id_key ON public.link USING btree (link_id);


--
-- Name: link_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX link_slug_idx ON public.link USING btree (slug);


--
-- Name: link_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX link_slug_key ON public.link USING btree (slug);


--
-- Name: link_team_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX link_team_id_idx ON public.link USING btree (team_id);


--
-- Name: link_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX link_user_id_idx ON public.link USING btree (user_id);


--
-- Name: pixel_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pixel_created_at_idx ON public.pixel USING btree (created_at);


--
-- Name: pixel_pixel_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pixel_pixel_id_key ON public.pixel USING btree (pixel_id);


--
-- Name: pixel_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pixel_slug_idx ON public.pixel USING btree (slug);


--
-- Name: pixel_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pixel_slug_key ON public.pixel USING btree (slug);


--
-- Name: pixel_team_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pixel_team_id_idx ON public.pixel USING btree (team_id);


--
-- Name: pixel_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pixel_user_id_idx ON public.pixel USING btree (user_id);


--
-- Name: report_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_name_idx ON public.report USING btree (name);


--
-- Name: report_report_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX report_report_id_key ON public.report USING btree (report_id);


--
-- Name: report_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_type_idx ON public.report USING btree (type);


--
-- Name: report_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_user_id_idx ON public.report USING btree (user_id);


--
-- Name: report_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_website_id_idx ON public.report USING btree (website_id);


--
-- Name: revenue_revenue_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX revenue_revenue_id_key ON public.revenue USING btree (revenue_id);


--
-- Name: revenue_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX revenue_session_id_idx ON public.revenue USING btree (session_id);


--
-- Name: revenue_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX revenue_website_id_created_at_idx ON public.revenue USING btree (website_id, created_at);


--
-- Name: revenue_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX revenue_website_id_idx ON public.revenue USING btree (website_id);


--
-- Name: revenue_website_id_session_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX revenue_website_id_session_id_created_at_idx ON public.revenue USING btree (website_id, session_id, created_at);


--
-- Name: segment_segment_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX segment_segment_id_key ON public.segment USING btree (segment_id);


--
-- Name: segment_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX segment_website_id_idx ON public.segment USING btree (website_id);


--
-- Name: session_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_created_at_idx ON public.session USING btree (created_at);


--
-- Name: session_data_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_data_created_at_idx ON public.session_data USING btree (created_at);


--
-- Name: session_data_session_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_data_session_id_created_at_idx ON public.session_data USING btree (session_id, created_at);


--
-- Name: session_data_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_data_session_id_idx ON public.session_data USING btree (session_id);


--
-- Name: session_data_website_id_created_at_data_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_data_website_id_created_at_data_key_idx ON public.session_data USING btree (website_id, created_at, data_key);


--
-- Name: session_data_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_data_website_id_idx ON public.session_data USING btree (website_id);


--
-- Name: session_session_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX session_session_id_key ON public.session USING btree (session_id);


--
-- Name: session_website_id_created_at_browser_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_browser_idx ON public.session USING btree (website_id, created_at, browser);


--
-- Name: session_website_id_created_at_city_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_city_idx ON public.session USING btree (website_id, created_at, city);


--
-- Name: session_website_id_created_at_country_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_country_idx ON public.session USING btree (website_id, created_at, country);


--
-- Name: session_website_id_created_at_device_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_device_idx ON public.session USING btree (website_id, created_at, device);


--
-- Name: session_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_idx ON public.session USING btree (website_id, created_at);


--
-- Name: session_website_id_created_at_language_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_language_idx ON public.session USING btree (website_id, created_at, language);


--
-- Name: session_website_id_created_at_os_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_os_idx ON public.session USING btree (website_id, created_at, os);


--
-- Name: session_website_id_created_at_region_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_region_idx ON public.session USING btree (website_id, created_at, region);


--
-- Name: session_website_id_created_at_screen_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_created_at_screen_idx ON public.session USING btree (website_id, created_at, screen);


--
-- Name: session_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_website_id_idx ON public.session USING btree (website_id);


--
-- Name: team_access_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX team_access_code_idx ON public.team USING btree (access_code);


--
-- Name: team_access_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX team_access_code_key ON public.team USING btree (access_code);


--
-- Name: team_team_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX team_team_id_key ON public.team USING btree (team_id);


--
-- Name: team_user_team_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX team_user_team_id_idx ON public.team_user USING btree (team_id);


--
-- Name: team_user_team_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX team_user_team_user_id_key ON public.team_user USING btree (team_user_id);


--
-- Name: team_user_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX team_user_user_id_idx ON public.team_user USING btree (user_id);


--
-- Name: user_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_user_id_key ON public."user" USING btree (user_id);


--
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- Name: website_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_created_at_idx ON public.website USING btree (created_at);


--
-- Name: website_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_created_by_idx ON public.website USING btree (created_by);


--
-- Name: website_event_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_created_at_idx ON public.website_event USING btree (created_at);


--
-- Name: website_event_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_session_id_idx ON public.website_event USING btree (session_id);


--
-- Name: website_event_visit_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_visit_id_idx ON public.website_event USING btree (visit_id);


--
-- Name: website_event_website_id_created_at_event_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_event_name_idx ON public.website_event USING btree (website_id, created_at, event_name);


--
-- Name: website_event_website_id_created_at_hostname_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_hostname_idx ON public.website_event USING btree (website_id, created_at, hostname);


--
-- Name: website_event_website_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_idx ON public.website_event USING btree (website_id, created_at);


--
-- Name: website_event_website_id_created_at_page_title_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_page_title_idx ON public.website_event USING btree (website_id, created_at, page_title);


--
-- Name: website_event_website_id_created_at_referrer_domain_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_referrer_domain_idx ON public.website_event USING btree (website_id, created_at, referrer_domain);


--
-- Name: website_event_website_id_created_at_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_tag_idx ON public.website_event USING btree (website_id, created_at, tag);


--
-- Name: website_event_website_id_created_at_url_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_url_path_idx ON public.website_event USING btree (website_id, created_at, url_path);


--
-- Name: website_event_website_id_created_at_url_query_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_created_at_url_query_idx ON public.website_event USING btree (website_id, created_at, url_query);


--
-- Name: website_event_website_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_idx ON public.website_event USING btree (website_id);


--
-- Name: website_event_website_id_session_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_session_id_created_at_idx ON public.website_event USING btree (website_id, session_id, created_at);


--
-- Name: website_event_website_id_visit_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_event_website_id_visit_id_created_at_idx ON public.website_event USING btree (website_id, visit_id, created_at);


--
-- Name: website_share_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_share_id_idx ON public.website USING btree (share_id);


--
-- Name: website_share_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX website_share_id_key ON public.website USING btree (share_id);


--
-- Name: website_team_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_team_id_idx ON public.website USING btree (team_id);


--
-- Name: website_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX website_user_id_idx ON public.website USING btree (user_id);


--
-- Name: website_website_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX website_website_id_key ON public.website USING btree (website_id);


--
-- PostgreSQL database dump complete
--

\unrestrict JED3TFbHKKjIZCLaR6y1IMcciRlEZbeB5E8kndfNlCWupgKvHLhwKp8KvzKbeGJ

