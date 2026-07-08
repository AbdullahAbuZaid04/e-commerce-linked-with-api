-- Drop default value that depends on the Role enum
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- Alter column type from Role enum to TEXT
ALTER TABLE "User" ALTER COLUMN "role" TYPE TEXT USING "role"::text;

-- Set new default
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';

-- DropEnum
DROP TYPE IF EXISTS "Role";
