import { GetServerSideProps } from "next";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

interface CommunityPageProps {
  communityDetails: any;
  user: any;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const user = await currentUser();

  if (!user) {
    return {
      notFound: true,
    };
  }

  const communityDetails = await fetchCommunityDetails(id);

  if (!communityDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      communityDetails,
      user,
    },
  };
};

const Page = ({ communityDetails, user }: CommunityPageProps) => {
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
};

export default Page;
