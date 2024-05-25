import { PRODUCTION_FLAGS, DEV_FLAGS } from "~/helpers/featureFlags.js";

export const useFeatureFlags = () =>
    useState('featureFlags', () => {
        const config = useRuntimeConfig();
        return config.public.production ? PRODUCTION_FLAGS : DEV_FLAGS
    })
