import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditUserPage = () => {
  //   if (isLoading) return <div>Loading...</div>;

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </div>
      <div>
        <label htmlFor="profilePic">Profile Picture URL</label>
        <Input id="profilePic" />
      </div>
      <div>
        <label htmlFor="favoriteMovie">Favorite Movie</label>
        <Input id="favoriteMovie" />
      </div>
      <div>
        <label htmlFor="letterboxdUsername">Letterboxd Username</label>
        <Input id="letterboxdUsername" />
      </div>
      <div>
        <label htmlFor="twitterUsername">Twitter Username</label>
        <Input id="twitterUsername" />
      </div>
      <div>
        <label htmlFor="bskyUsername">Bluesky Username</label>
        <Input id="bskyUsername" />
      </div>
      <div>
        <label htmlFor="githubUsername">Github Username</label>
        <Input id="githubUsername" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default EditUserPage;
