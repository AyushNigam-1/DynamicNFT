/**
 * Get HOURS_PER_LEVEL constant from contract
 * @param {ethers.Contract} contract
 */
export async function getHoursPerLevel(contract, user) {
    if (!contract) throw new Error("Contract not initialized");

    try {
        const hours = await contract.getTotalHoursForLevel(user);
        console.log("hours2", hours)
        return { success: true, hours: Number(hours) };
    } catch (err) {
        console.error("getHoursPerLevel failed:", err);
        return { success: false, error: err.message || "Failed to fetch HOURS_PER_LEVEL" };
    }
}

/**
 * Set HOURS_PER_LEVEL (requires signer)
 * @param {number} newHours
 * @param {ethers.Contract} contract
 */
export async function setHoursPerLevel(newHours, contract) {
    if (!contract) throw new Error("Contract not initialized");

    try {
        const tx = await contract.setHoursPerLevel(newHours);
        const receipt = await tx.wait();
        return { success: true, transactionHash: receipt.hash };
    } catch (err) {
        console.error("setHoursPerLevel failed:", err);
        return { success: false, error: err.message || "Failed to set HOURS_PER_LEVEL" };
    }
}