import { deleteAsync } from "del";
export async function del() {
    await deleteAsync([app.path.clean]);
}
