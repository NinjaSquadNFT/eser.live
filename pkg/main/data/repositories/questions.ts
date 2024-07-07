// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { and, eq, isNull, sql } from "drizzle-orm";
import { type QuestionPartial, questionSchema } from "../models/question.ts";
import { userSchema } from "../models/user.ts";
import {
  type QuestionVotePartial,
  questionVoteSchema,
} from "../models/question-vote.ts";
import { db } from "../db.ts";

export { type Question, type QuestionPartial } from "../models/question.ts";

export class QuestionRepository {
  async findAll() {
    const result = await db.query.questionSchema
      .findMany({
        where: isNull(questionSchema.deletedAt),
      });

    return result;
  }

  async findAllByUserId(userId: string) {
    const result = await db.query.questionSchema
      .findMany({
        where: and(
          eq(questionSchema.userId, userId),
          isNull(questionSchema.deletedAt),
        ),
      });

    return result;
  }

  async findAllVotesByUserId(userId: string) {
    const result = await db.query.questionSchema
      .findMany({
        where: eq(questionVoteSchema.userId, userId),
      });

    return result;
  }

  async upsertVote(questionVote: QuestionVotePartial) {
    const [result] = await db.insert(questionVoteSchema)
      .values(questionVote)
      .onConflictDoUpdate({
        target: [questionVoteSchema.questionId, questionVoteSchema.userId],
        set: questionVote,
      })
      .returning();

    return result;
  }

  async findAllWithScores(viewingUserId?: string) {
    const scoreSumUserCalculation = viewingUserId !== undefined
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const result = await db.select({
      id: questionSchema.id,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      content: questionSchema.content,
      isAnonymous: questionSchema.isAnonymous,
      answeredAt: questionSchema.answeredAt,
      answeredAtUri: questionSchema.answeredAtUri,
      createdAt: questionSchema.createdAt,
      updatedAt: questionSchema.updatedAt,
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(userSchema, eq(questionSchema.userId, userSchema.id))
      .leftJoin(
        questionVoteSchema,
        eq(questionSchema.id, questionVoteSchema.questionId),
      )
      .where(
        and(
          eq(questionSchema.isHidden, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        userSchema.id,
      )
      .orderBy(sql`total_score_sum DESC, ${questionSchema.createdAt} DESC`);

    return result;
  }

  async findAllByUserIdWithScores(userId: string, viewingUserId?: string) {
    const scoreSumUserCalculation = viewingUserId !== undefined
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const result = await db.select({
      id: questionSchema.id,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      content: questionSchema.content,
      isAnonymous: questionSchema.isAnonymous,
      answeredAt: questionSchema.answeredAt,
      answeredAtUri: questionSchema.answeredAtUri,
      createdAt: questionSchema.createdAt,
      updatedAt: questionSchema.updatedAt,
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(userSchema, eq(questionSchema.userId, userSchema.id))
      .leftJoin(
        questionVoteSchema,
        eq(questionSchema.id, questionVoteSchema.questionId),
      )
      .where(
        and(
          eq(questionSchema.userId, userId),
          eq(questionSchema.isHidden, false),
          eq(questionSchema.isAnonymous, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        userSchema.id,
      )
      .orderBy(sql`total_score_sum DESC, ${questionSchema.createdAt} DESC`);

    return result;
  }

  async findById(id: string) {
    const result = await db.query.questionSchema
      .findFirst({
        where: and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)),
      });

    return result;
  }

  async create(question: QuestionPartial) {
    const [result] = await db.insert(questionSchema)
      .values(question)
      .returning();

    return result;
  }

  async update(id: string, question: Partial<QuestionPartial>) {
    const [result] = await db.update(questionSchema)
      .set({ ...question, updatedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning();

    return result;
  }

  async delete(id: string) {
    const [result] = await db.update(questionSchema)
      .set({ deletedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning();

    return result;
  }
}

export const questionRepository = new QuestionRepository();
