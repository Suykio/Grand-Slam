insert into public.teams (id, name, abbr) values
  (1, 'Tiburones de Neo-Guayana', 'TNG'),
  (2, 'Centinelas de Capital', 'CC'),
  (3, 'Leones del Valle', 'LV'),
  (4, 'Águilas del Litoral', 'AL'),
  (5, 'Bravos del Puerto', 'BP'),
  (6, 'Cóndores del Sur', 'CS');

insert into public.news (title, body) values
  ('Los Tiburones aseguran el primer lugar', 'Con una racha de ocho victorias, Neo-Guayana llega a la semifinal como líder de la ronda regular.'),
  ('Centinelas de Capital refuerza su bullpen', 'El cuerpo técnico anunció cambios en la rotación para la fase final.');

insert into public.transactions (kind, body) values
  ('Firma', 'Bravos del Puerto firman al relevista Héctor Villasmil por dos temporadas.'),
  ('Rumor', 'Fuentes cercanas indican que Tiburones buscan un cerrador antes de la final.');
