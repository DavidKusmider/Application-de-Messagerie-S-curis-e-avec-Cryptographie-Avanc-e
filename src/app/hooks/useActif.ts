import { useParams } from "next/navigation";
import { useMemo } from "react";

const useActif = () => {
  const params = useParams();

  const actif = useMemo(() => {
    if (!params?.actif) {
      return 'groups';
    }

    return params.actif as string;
  }, [params?.actif]);

  const isOpen = useMemo(() => !!actif, [actif]);

  return useMemo(() => ({
    isOpen,
    actif
  }), [isOpen, actif]);
};

export default useActif;
