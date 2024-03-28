import { useEffect, useState } from "react";
import { ActivityContentProfile } from "@dsnp/activity-content/types";
import * as dsnpLink from "../dsnpLink";
import { User } from "../types";
import { getContext } from "./AuthService";

const profileCache: Map<string, Promise<User>> = new Map();

const profileToUser = (profile: dsnpLink.Profile): User => {
  let userProfile: User["profile"] | undefined = undefined;
  if (profile.content) {
    const contentParsed = JSON.parse(profile.content) as ActivityContentProfile;
    userProfile = {
      icon: contentParsed.icon?.[0].href || "",
      name: contentParsed.name || "",
    };
  }
  return {
    handle: profile.displayHandle || "Anonymous",
    dsnpId: profile.fromId,
    profile: userProfile,
  };
};

export const getUserProfile = (dsnpId: string): Promise<User | null> => {
  // Check if the profile is already cached
  const cached = profileCache.get(dsnpId);
  if (cached) return cached;

  // Profile not found in cache, fetch from the server
  try {
    const profile = dsnpLink
      .getProfile(getContext(), { dsnpId })
      .then(profileToUser);
    profileCache.set(dsnpId, profile);
    return profile;
  } catch (error) {
    console.error(`Failed to fetch user profile for DSNP ID ${dsnpId}:`, error);
    return Promise.resolve(null);
  }
};

const loadingUser = { handle: "Loading", dsnpId: "" };

type UseGetUserResp = { user: User; isLoading: boolean; error: string };
export const useGetUser = (dsnpId: string): UseGetUserResp => {
  const [user, setUser] = useState<User>(loadingUser);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserProfile(dsnpId)
      .then((resp) => {
        if (resp === null) {
          setUser({
            handle: "unknown",
            dsnpId: "",
          });
          setError("Unknown User");
        } else {
          setUser(resp);
          setError("");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setIsLoading(false);
      });
  }, [dsnpId]);

  return { user, isLoading, error };
};
