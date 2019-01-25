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
  phone char(10) NOT NULL,
  agency text NOT NULL, -- might be another table with foreign key when we learn more
  role text NOT NULL, -- might be another table with foreign key when we learn more
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

CREATE TABLE IF NOT EXISTS ideas.review (
  id serial primary key,
  reviewer_id integer REFERENCES ideas.reviewer(id) NOT NULL
  -- need to put required fields
);

CREATE TABLE IF NOT EXISTS ideas.presentation (
  id serial primary key,
  submission_date timestamp NOT NULL,
  title text NOT NULL,
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
  posting_agreement boolean NOT NULL,
  vendor boolean NOT NULL,
  vendor_agreement boolean CONSTRAINT need_vendor CHECK(vendor = (vendor_agreement IS NOT NULL)),
  comments text,
  presenter_id integer REFERENCES ideas.attendee(id) NOT NULL,
  biography text NOT NULL,
  copresenter_1_id integer REFERENCES ideas.attendee(id),
  copresenter_2_id integer REFERENCES ideas.attendee(id),
  copresenter_3_id integer REFERENCES ideas.attendee(id),
  time tstzrange,
  room text,
  category_id integer REFERENCES ideas.category(id),
  accepted boolean,
  CONSTRAINT unique_presenters CHECK (
    (copresenter_1_id IS NULL OR (copresenter_1_id != presenter_id)) AND
    (copresenter_2_id IS NULL OR (copresenter_1_id IS NOT NULL AND copresenter_2_id != presenter_id AND copresenter_2_id != copresenter_1_id)) AND
    (copresenter_3_id IS NULL OR (copresenter_1_id IS NOT NULL AND copresenter_2_id IS NOT NULL AND copresenter_3_id != presenter_id AND copresenter_3_id != copresenter_1_id AND copresenter_3_id != copresenter_2_id))
  )
);

CREATE TABLE IF NOT EXISTS ideas.presentation_review (
  presentation_id integer REFERENCES ideas.presentation(id) NOT NULL,
  review_id integer REFERENCES ideas.review(id) NOT NULL UNIQUE,
  primary key (presentation_id, review_id)
);
