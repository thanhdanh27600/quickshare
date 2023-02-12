import {getForwardUrl} from "api/requests";
import {Loading} from "components/atoms/Loading";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useMutation} from "react-query";

const Hash = () => {
	const router = useRouter();
	const {hash} = router.query;
	const forwardUrl = useMutation("forward", getForwardUrl);
	const loading = forwardUrl.isLoading;

	useEffect(() => {
		if (!hash || !hash[0]) {
			return;
		}
		forwardUrl.mutate(hash[0] as string);
	}, [hash]);

	if (loading) return <Loading />;
	let url = forwardUrl.data?.history?.url;
	if (!url) {
		return <div>Invalid Forward URL</div>;
	}
	location.replace(`${url.includes("http") ? "" : "//"}${url}`);
};

export default Hash;
