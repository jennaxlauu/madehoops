/*
  # Remove Email Unique Constraint and Import Athlete Data
  
  1. Changes
    - Remove unique constraint on email (multiple family members can share emails)
    - Import athlete data from CSV
    
  2. Notes
    - Families often share a single email address
    - Each athlete still has a unique ID
*/

-- Remove unique constraint on email
ALTER TABLE athletes DROP CONSTRAINT IF EXISTS athletes_email_key;

-- Import sample athlete data
INSERT INTO athletes (first_name, last_name, email, phone, date_of_birth, age, tier, membership)
VALUES 
  ('Siara', 'Arnette', 'sarnette08@gmail.com', '19173281012', NULL, NULL, 'standard', NULL),
  ('John', 'Doe', 'nlinhart33+3@gmail.com', '16148046336', NULL, NULL, 'standard', NULL),
  ('John', 'Smith', 'morseroadventures@gmail.com', '16148046336', NULL, NULL, 'standard', NULL),
  ('Nadir', 'Abubaka', 'nadir876@aim.com', '13474151148', NULL, NULL, 'standard', NULL),
  ('Jensy', 'Acevedo', 'jensyacevedo@gmail.com', '19174492607', NULL, NULL, 'standard', NULL),
  ('DYLAN', 'ANGEL', 'smilanoangel@mac.com', '19175620700', NULL, NULL, 'standard', NULL),
  ('JASON', 'APTOWITZ', 'jma@jmaengineer.com', '16462085920', NULL, NULL, 'standard', NULL),
  ('Nate', 'Linhart', 'nlinhart33@gmail.com', '16148046336', '1986-11-14', 39, 'standard', 'Test membership for Nate and Alexa'),
  ('Alexa', 'Meltzer', 'alexa.meltzer@sc.holdings', '19173488138', NULL, NULL, 'standard', 'Test membership for Nate and Alexa'),
  ('Jonathan', 'Adler', 'jonathan@madehoops.com', '19144691959', NULL, NULL, 'standard', NULL),
  ('Brielle', 'Keith', 'sarnette08@gmail.com', '19173281012', '2013-11-06', 12, 'standard', 'Riverside Lady Hawks'),
  ('Lebron', 'James', 'nlinhart33+3@gmail.com', '16148046336', '2013-12-03', 12, 'standard', NULL),
  ('Demar', 'Derozan', 'morseroadventures@gmail.com', '16148046336', '2012-09-04', 13, 'standard', NULL),
  ('Alexander', 'Bychkov', 'vb_11230@yahoo.com', '13479269690', '2013-08-25', 12, 'standard', NULL),
  ('Sebastian', 'Bychkov', 'vb_11230@yahoo.com', '13479269690', '2016-11-25', 9, 'standard', NULL),
  ('Wesley', 'White', 'ws.white10@gmail.com', '17187550925', NULL, NULL, 'standard', NULL),
  ('Walker', 'White', 'ws.white10@gmail.com', '17187550925', '2015-08-30', 10, 'standard', 'EEP Bandits'),
  ('Weston', 'White', 'ws.white10@gmail.com', '17187550925', '2018-02-17', 8, 'standard', 'SFX Huskies'),
  ('Alistair', 'Chin', 'terrencenyc@gmail.com', '19172263662', '2016-01-11', 10, 'standard', 'HMBL'),
  ('Nathan Jr', 'Linhart', 'natel@madehoops.com', '16148046336', '2012-11-14', 13, 'standard', NULL),
  ('Emma', 'Linhart', 'natel@madehoops.com', '16148046336', '2012-02-07', 14, 'standard', NULL),
  ('Mo', 'Stein', 'jasonwstein@gmail.com', '19146295757', '2014-11-01', 11, 'standard', 'New Heights'),
  ('Sonny', 'Stein', 'jasonwstein@gmail.com', '19146295757', '2017-09-22', 8, 'standard', NULL),
  ('Cameron', 'Adler', 'jonathan@madehoops.com', '19144691959', '2019-08-21', 6, 'standard', NULL),
  ('Silas', 'Schwartz', 'chessie.schwartz@gmail.com', '19174841231', '2016-07-08', 9, 'standard', NULL)
ON CONFLICT (id) DO NOTHING;
