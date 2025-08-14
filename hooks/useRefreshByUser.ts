import { useState } from "react";

export function useRefreshByUser(refetch: () => Promise<unknown>) {
	const [isRefreshingByUser, setIsRefreshingByUser] = useState(false);

	async function refetchByUser() {
		setIsRefreshingByUser(true);
		try {
			await refetch();
		} finally {
			setIsRefreshingByUser(false);
		}
	}

	return {isRefreshingByUser, refetchByUser};
}