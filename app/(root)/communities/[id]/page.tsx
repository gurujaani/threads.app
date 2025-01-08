import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

interface CommunityPageProps {
  params: { id: string };
}

async function Page({ params }: CommunityPageProps) {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="error-message">
        <p>You need to be logged in to view this community.</p>
      </div>
    );
  }

  try {
    const communityDetails = await fetchCommunityDetails(params.id);

    if (!communityDetails) {
      return (
        <div className="error-message">
          <p>Community not found.</p>
        </div>
      );
    }

    return (
      <section>
        <ProfileHeader
          accountId={communityDetails?.createdBy?.id || ""}
          authUserId={user.id}
          name={communityDetails?.name || "Unknown"}
          username={communityDetails?.username || "unknown"}
          imgUrl={communityDetails?.image || "/default-image.png"}
          bio={communityDetails?.bio || "No bio available"}
          type="Community"
        />

        <div className="mt-9">
          <Tabs defaultValue="threads" className="w-full">
            <TabsList className="tab">
              {communityTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon || "/default-icon.png"}
                    alt={tab.label || "Default"}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Threads" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails.threads?.length || 0}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="threads" className="w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType="Community"
              />
            </TabsContent>

            <TabsContent value="members" className="mt-9 w-full text-light-1">
              <section className="mt-9 flex flex-col gap-10">
                {communityDetails.members?.map((member: any) => (
                  <UserCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    username={member.username}
                    imgUrl={member.image}
                    personType="User"
                  />
                ))}
              </section>
            </TabsContent>

            <TabsContent value="requests" className="w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType="Community"
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching community details:", error);
    return (
      <div className="error-message">
        <p>Failed to load community details. Please try again later.</p>
      </div>
    );
  }
}

export default Page;
