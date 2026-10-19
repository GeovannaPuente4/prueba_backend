-- Seed a default admin user
INSERT INTO "users" ("email", "password") VALUES ('admin@admin.com', 'adminpruebacristina') ON CONFLICT ("email") DO NOTHING;
