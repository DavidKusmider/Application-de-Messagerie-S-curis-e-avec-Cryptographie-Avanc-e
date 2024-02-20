-- CreateTable
CREATE TABLE "Blocked" (
    "id_user" BIGINT NOT NULL,
    "id_user_blocked" BIGINT NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id_user","id_user_blocked")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id_user1" BIGINT NOT NULL,
    "friend_state" SMALLINT NOT NULL,
    "id_user2" BIGINT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id_user1","id_user2")
);

-- CreateTable
CREATE TABLE "Group" (
    "id_group" BIGSERIAL NOT NULL,
    "group_name" VARCHAR NOT NULL DEFAULT '',
    "group_picture" VARCHAR NOT NULL DEFAULT '',
    "id_user_creator" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id_group")
);

-- CreateTable
CREATE TABLE "Message" (
    "id_msg" BIGSERIAL NOT NULL,
    "id_user" BIGINT NOT NULL,
    "id_group" BIGINT NOT NULL,
    "msg_content" VARCHAR NOT NULL DEFAULT '',
    "id_parent_msg" BIGINT,
    "send_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id_msg")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" BIGSERIAL NOT NULL,
    "pseudo" VARCHAR NOT NULL DEFAULT '',
    "user_name" VARCHAR NOT NULL DEFAULT '',
    "email" VARCHAR NOT NULL DEFAULT '',
    "pwd" VARCHAR NOT NULL DEFAULT '',
    "type_of_mfa" VARCHAR,
    "user_state" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_id_user1_key" ON "Friend"("id_user1");

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "public_Blocked_id_user_blocked_fkey" FOREIGN KEY ("id_user_blocked") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "public_Blocked_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "public_Friend_id_user1_fkey" FOREIGN KEY ("id_user1") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "public_Friend_id_user2_fkey" FOREIGN KEY ("id_user2") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "public_Group_id_user_creator_fkey" FOREIGN KEY ("id_user_creator") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "public_Message_id_group_fkey" FOREIGN KEY ("id_group") REFERENCES "Group"("id_group") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "public_Message_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE SET DEFAULT ON UPDATE CASCADE;
