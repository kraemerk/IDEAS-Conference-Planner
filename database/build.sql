CREATE EXTENSION citext;

DROP SCHEMA IF EXISTS ideas CASCADE;
CREATE SCHEMA ideas;

CREATE TABLE IF NOT EXISTS ideas.attendee (
  id serial primary key,
  creation_date timestamp default current_timestamp,
  prefix text,
  first text NOT NULL,
  last text NOT NULL,
  email citext NOT NULL,
  phone text,
  agency text NOT NULL, -- might be another table with foreign key when we learn more
  role text, -- might be another table with foreign key when we learn more
  -- Add more attendee fields when we see eventmobi registration process
  UNIQUE(prefix, first, last)
);

CREATE TABLE IF NOT EXISTS ideas.category (
  id serial primary key,
  title text NOT NULL
);

CREATE TABLE IF NOT EXISTS ideas.reviewer (
  id serial primary key,
  first text NOT NULL,
  last text NOT NULL,
  UNIQUE(first, last)
);

CREATE TABLE IF NOT EXISTS ideas.presentation (
  id serial primary key,
  submission_date timestamp NOT NULL,
  title text NOT NULL UNIQUE,
  description text NOT NULL,
  objective_1 text NOT NULL,
  objective_2 text NOT NULL,
  objective_3 text NOT NULL,
  repurposed_agreement boolean NOT NULL,
  setup_agreement boolean NOT NULL,
  equipment_agreement boolean NOT NULL,
  backup_agreement boolean NOT NULL,
  timelimit_agreement boolean NOT NULL,
  time_agreement boolean NOT NULL,
  handout_agreement boolean NOT NULL,
  acceptance_agreement boolean NOT NULL,
  registration_agreement boolean NOT NULL,
  copyright_agreement boolean NOT NULL,
  --posting_agreement boolean NOT NULL,
  vendor boolean NOT NULL,
  vendor_agreement boolean CONSTRAINT need_vendor CHECK(vendor = (vendor_agreement IS NOT NULL)),
  comments text,
  presenter_id integer REFERENCES ideas.attendee(id) NOT NULL,
  presenter_biography text NOT NULL,
  copresenter_1_id integer REFERENCES ideas.attendee(id),
  copresenter_2_id integer REFERENCES ideas.attendee(id),
  copresenter_3_id integer REFERENCES ideas.attendee(id),
  time tstzrange,
  room text,
  category_id integer REFERENCES ideas.category(id),
  overall_rating integer,
  accepted boolean,
  CONSTRAINT unique_presenters CHECK (
    (copresenter_1_id IS NULL OR (copresenter_1_id != presenter_id)) AND
    (copresenter_2_id IS NULL OR (copresenter_1_id IS NOT NULL AND copresenter_2_id != presenter_id AND copresenter_2_id != copresenter_1_id)) AND
    (copresenter_3_id IS NULL OR (copresenter_1_id IS NOT NULL AND copresenter_2_id IS NOT NULL AND copresenter_3_id != presenter_id AND copresenter_3_id != copresenter_1_id AND copresenter_3_id != copresenter_2_id))
  )
);

CREATE TABLE IF NOT EXISTS ideas.review (
  id serial primary key,
  reviewer_id integer REFERENCES ideas.reviewer(id) NOT NULL,
  presentation_id integer REFERENCES ideas.presentation(id) NOT NULL,
  grammar_rating integer NOT NULL,
  title_rating integer NOT NULL,
  credibility_rating integer NOT NULL,
  interest_rating integer NOT NULL,
  content_rating integer NOT NULL,
  novelty_rating integer NOT NULL,
  overall_rating integer NOT NULL,
  UNIQUE(reviewer_id, presentation_id)
  -- these rating categories may change as we find out more concrete information
);

INSERT INTO ideas.reviewer (first, last) VALUES ('Micah', 'Halter');
