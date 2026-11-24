import { mutationOptions } from "@tanstack/react-query";
import { customAlphabet } from "nanoid";

import { spacesQueryOptions } from "#src/core/queries/spaces-query.ts";
import { authClient } from "#src/lib/auth.ts";
import { queryClient } from "#src/lib/query.ts";

const generateSlug = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export const createSpaceMutationOptions = () =>
  mutationOptions({
    mutationKey: ["spaces", "create"],
    mutationFn: async (name: string) => {
      const { data: space, error } = await authClient.organization.create({
        name,
        slug: generateSlug(),
      });

      if (error) throw error;
      return space;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spacesQueryOptions().queryKey });
    },
  });
