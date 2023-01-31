import {useRouter} from "next/router";
const Hash = () => {
	const router = useRouter();
	const {hash} = router.query;
    return <div>Hash : {hash}</div>;
};

export default Hash;
