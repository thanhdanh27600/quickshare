import {getForwardUrl} from "api/requests";
import {Loading} from "components/atoms/Loading";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useMutation} from "react-query";

const Hash = () => {
	const router = useRouter();
	const {hash} = router.query;
	if (!hash || !hash[0]) {
		return <div>Invalid URL</div>;
	}
	const forwardUrl = useMutation("forward", getForwardUrl);

	useEffect(() => {
		forwardUrl.mutate(hash[0] as string);
	}, []);

	const loading = forwardUrl.isLoading;

	if (loading) return <Loading />;
	if (!forwardUrl.data?.history?.url) {
		return <div>Invalid Forward URL</div>;
	}
	router.replace(forwardUrl.data?.history?.url);
};

export default Hash;
