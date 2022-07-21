import {HardcodedStorage} from "./hardcodedStorage"
import {DataEntry} from "./storageInterface"

test('Creates Valid Hardcoded Items', async () => {
    const result = new HardcodedStorage().getData({});
    const dataEntries: DataEntry[] = await result;
    expect(dataEntries[0].get("Name")).toBe("Start things");
});

test('Updates Valid Hardcoded Items', async () => {
    const result = new HardcodedStorage().addOrUpdateData([]);
    const dataEntries: DataEntry[] = await result;
    expect(dataEntries[0].get("Name")).toBe("Start things");
});

test('Copies Still Contain Same Data', async () => {
    const result = new HardcodedStorage().addOrUpdateData([]);
    const dataEntries: DataEntry[] = await result;
    const copyOfFirst = dataEntries[1].copy();
    expect(copyOfFirst.get("Name")).toBe("Finish things");
});
