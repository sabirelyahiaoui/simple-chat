import Knex from "knex";
import * as config from "./knexfile";

const knex = Knex(config);

const messages = () => knex<Message>("messages");

/**
 * Stores single Message in database
 */
export async function store(message: Message): Promise<void> {
  await messages().insert(message);
}

/**
 * Retrieves single message from database
 */
export async function getById(id: string): Promise<Message | undefined> {
  return messages()
    .where({ id })
    .select("*")
    .first();
}

/**
 * Updates database record for given Message object
 */
export async function update(message: Message): Promise<void> {
  await messages()
    .where({ id: message.id })
    .update(message);
}

/**
 * Removes single Message from database
 */
export async function remove(id: string): Promise<void> {
  await messages()
    .where({ id })
    .del();
}

/**
 * Returns an array of the latest <amount> messages
 */
export async function getMany(amount: number = 50): Promise<Message[]> {
  return messages()
    .select("*")
    .limit(amount);
}

/**
 * Returns an array of the latest <amount> messages that were sent before the given message
 */
export async function getMore(
  messageId: string,
  amount: number = 50,
): Promise<Message[]> {
  const results = await messages()
    .select("*")
    .where(
      "dateCreated",
      "<",
      messages()
        .select("dateCreated")
        .where({ id: messageId }),
    )
    .orderBy("dateCreated", "desc")
    .limit(amount);

  return results.reverse();
}
