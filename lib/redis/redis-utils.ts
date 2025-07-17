import redisClient from "@/lib/redis";

export async function deleteByPrefix(prefix: string) {
  let cursor = 0;

  do {
    const res = await redisClient.scan(cursor, {
      match: `${prefix}*`,
      count: 100,
    });

    cursor = Number(res[0]);
    const keys = res[1];

    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } while (cursor !== 0);
}
