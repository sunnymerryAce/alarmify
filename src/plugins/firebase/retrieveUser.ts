import { getUserFromFirestore } from '.';

/**
 * Firestoreからユーザー情報を取得するAPI
 * @returns ユーザー情報
 */
const retrieveUser = async (): Promise<User | null> => {
  const {
    data,
  }: Api.GetUserFromFirestoreResponse = await getUserFromFirestore().catch(
    () => {
      return {
        data: {
          ok: false,
        },
      };
    },
  );
  return data.ok && data.user ? data.user : null;
};

export default retrieveUser;
