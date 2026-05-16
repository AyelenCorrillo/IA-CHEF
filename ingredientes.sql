--
-- PostgreSQL database dump
--

\restrict 7zjKCEcRh6eFs3HFuP8LF47UJ9hCuFUq1gzeuqxGxNihZFortfnzdowY8DNod8M

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE public.ingredientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    imagen_url VARCHAR(255),
    categoria_id BIGINT,
    
    CONSTRAINT fk_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categorias(id)
);

INSERT INTO categorias (nombre)
VALUES
('Verduras'),
('Frutas'),
('Proteinas'),
('Lacteos'),
('Otros'),
('Legumbres');


ALTER TABLE public.ingredientes OWNER TO chefia_user;


INSERT INTO public.ingredientes VALUES (1, 'Tomate', '/images/API_image/tomate.png', 1);
INSERT INTO public.ingredientes VALUES (2, 'Cebolla', '/images/API_image/cebolla.png', 1);
INSERT INTO public.ingredientes VALUES (3, 'Ajo', '/images/API_image/ajo.png', 1);
INSERT INTO public.ingredientes VALUES (4, 'Papa', '/images/API_image/papa.png', 1);
INSERT INTO public.ingredientes VALUES (5, 'Zanahoria', '/images/API_image/zanahoria.png', 1);
INSERT INTO public.ingredientes VALUES (6, 'Espinaca', '/images/API_image/espinaca.png', 1);
INSERT INTO public.ingredientes VALUES (7, 'Palta', '/images/API_image/palta.png', 1);
INSERT INTO public.ingredientes VALUES (8, 'Pimiento', '/images/API_image/pimiento.png', 1);
INSERT INTO public.ingredientes VALUES (9, 'Brócoli', '/images/API_image/brocoli.png', 1);
INSERT INTO public.ingredientes VALUES (10, 'Manzana', '/images/API_image/manzana.png', 2);
INSERT INTO public.ingredientes VALUES (11, 'Banana', '/images/API_image/banana.png', 2);
INSERT INTO public.ingredientes VALUES (12, 'Naranja', '/images/API_image/naranja.png', 2);
INSERT INTO public.ingredientes VALUES (13, 'Frutilla', '/images/API_image/frutilla.png', 2);
INSERT INTO public.ingredientes VALUES (14, 'Pescado', '/images/API_image/pescado.png', 3);
INSERT INTO public.ingredientes VALUES (15, 'Huevo', '/images/API_image/huevo.png', 3);
INSERT INTO public.ingredientes VALUES (16, 'Cerdo', '/images/API_image/cerdo.png', 3);
INSERT INTO public.ingredientes VALUES (17, 'Queso', '/images/API_image/queso.png', 4);
INSERT INTO public.ingredientes VALUES (18, 'Leche', '/images/API_image/leche.png', 4);
INSERT INTO public.ingredientes VALUES (19, 'Manteca', '/images/API_image/manteca.png', 4);
INSERT INTO public.ingredientes VALUES (20, 'Yogur', '/images/API_image/yogur.png', 4);
INSERT INTO public.ingredientes VALUES (21, 'Arroz', '/images/API_image/arroz.png', 5);
INSERT INTO public.ingredientes VALUES (22, 'Fideos', '/images/API_image/fideos.png', 5);
INSERT INTO public.ingredientes VALUES (23, 'Pan', '/images/API_image/pan.png', 5);
INSERT INTO public.ingredientes VALUES (24, 'Aceite', '/images/API_image/aceite.png', 5);
INSERT INTO public.ingredientes VALUES (25, 'Harina', '/images/API_image/harina.png', 5);
INSERT INTO public.ingredientes VALUES (26, 'Pollo', '/images/API_image/pollo.png', 3);
INSERT INTO public.ingredientes VALUES (27, 'Carne', '/images/API_image/carne.png', 3);
INSERT INTO public.ingredientes VALUES (28, 'Zucchini', '/images/API_image/zucchini.png', 1);
INSERT INTO public.ingredientes VALUES (29, 'Berenjena', '/images/API_image/berenjena.png', 1);
INSERT INTO public.ingredientes VALUES (30, 'Pepino', '/images/API_image/pepino.png', 1);
INSERT INTO public.ingredientes VALUES (31, 'Limon', '/images/API_image/limon.png', 1);
INSERT INTO public.ingredientes VALUES (32, 'Avena', '/images/API_image/avena.png', 5);
INSERT INTO public.ingredientes VALUES (33, 'Queso crema', '/images/API_image/quesocrema.png', 4);
INSERT INTO public.ingredientes VALUES (34, 'Lentejas', '/images/API_image/lentejas.png', 6);
INSERT INTO public.ingredientes VALUES (35, 'Garbanzos', '/images/API_image/garbanzos.png', 6);
INSERT INTO public.ingredientes VALUES (36, 'Choclo', '/images/API_image/choclo.png', 1);
INSERT INTO public.ingredientes VALUES (37, 'Arvejas', '/images/API_image/arvejas.png', 6);
INSERT INTO public.ingredientes VALUES (38, 'Porotos', '/images/API_image/porotos.png', 6);
INSERT INTO public.ingredientes VALUES (39, 'Salsa de soja', '/images/API_image/salsadesoja.png', 5);
INSERT INTO public.ingredientes VALUES (40, 'Aceto balsamico', '/images/API_image/acetobalsamico.png', 5);
INSERT INTO public.ingredientes VALUES (41, 'Pera', '/images/API_image/pera.png', 2);
INSERT INTO public.ingredientes VALUES (42, 'Durazno', '/images/API_image/durazno.png', 2);


SELECT pg_catalog.setval('public.ingredientes_id_seq', 42, true);

--
-- PostgreSQL database dump complete
--

\unrestrict 7zjKCEcRh6eFs3HFuP8LF47UJ9hCuFUq1gzeuqxGxNihZFortfnzdowY8DNod8M

