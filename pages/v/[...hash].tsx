import { getForwardUrl } from 'api/requests';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMutation } from 'react-query';

const Hash = () => {
  const router = useRouter();
  const { hash } = router.query;
  const forwardUrl = useMutation('forward', getForwardUrl);
  const loading = forwardUrl.isLoading && !forwardUrl.isError;
  const url = forwardUrl.data?.history?.url;

  useEffect(() => {
    if (!hash || !hash[0]) {
      return;
    }
    // forwardUrl.mutate({hash: hash[0] as string, isMobile: isMobile()});
  }, [hash]);

  useEffect(() => {
    if (loading) return;
    if (!url) {
      if (typeof window !== undefined && forwardUrl.isSuccess) {
        location.replace('/');
      }
      return;
    }
    location.replace(`${url.includes('http') ? '' : '//'}${url}`);
  }, [forwardUrl]);

  return forwardUrl.isError ? <p>Sorry, something got wrong :(</p> : <></>;
};

export default Hash;
