import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession, type SessionData } from "../lib/api";
import { SESSIONS } from "./useSessions";

const useDeleteSession = (sessionId: string) => {
	const queryClient = useQueryClient();
	const { mutate: deleteThisSession, ...rest } = useMutation({
		mutationFn: () => deleteSession(sessionId),
		onSuccess: () => {
			queryClient.setQueryData([SESSIONS], (cache: SessionData[] | undefined) =>
				cache?.filter((session) => session._id !== sessionId)
			);
		},
	});
	return { deleteThisSession, ...rest };
};

export default useDeleteSession;
