import Button from "./Button";

function AccountSettings() {
  async function handleSubmit() {
    try {
      // TODO: figure out image upload
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form>
        <label htmlFor="img">Submit new profile picture</label>
        <input type="file" id="img" name="img" accept="image" />
        <Button>Upload Picture</Button>
      </form>
    </div>
  );
}

export default AccountSettings;
