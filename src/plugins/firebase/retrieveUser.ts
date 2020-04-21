import { getUserFromFirestore } from '.';
import { User } from 'types/user';

export interface GetUserFromFirestoreResponse
  extends firebase.functions.HttpsCallableResult {
  readonly data: {
    ok: boolean;
    user?: User;
    error?: string;
  };
}

/**
 * Firestoreからユーザー情報を取得するAPI
 * @returns ユーザー情報
 */
const retrieveUser = async (): Promise<User | null> => {
  const {
    data,
  }: GetUserFromFirestoreResponse = await getUserFromFirestore().catch(
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
