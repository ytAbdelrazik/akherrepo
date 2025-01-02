import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as os from 'os';
import * as zlib from 'zlib';



@Injectable()
export class BackupService {
    private backupInterval: NodeJS.Timeout | null = null; // To store the interval instance

    constructor(@InjectConnection() private readonly connection: Connection) { }

    /**
     * Fetch entire dataset from the database dynamically.
     */
    private async fetchDataset(): Promise<any> {
        const collections = await this.connection.db.listCollections().toArray();
        const dataset: Record<string, any[]> = {};

        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await this.connection.db.collection(collectionName).find().toArray();
            dataset[collectionName] = data;
        }

        return dataset;
    }

    /**
     * Create a backup file with the entire dataset.
     */
    async createBackup(): Promise<string> {
        const dataset = await this.fetchDataset();

        // Compress the dataset
        const compressedData = zlib.gzipSync(JSON.stringify(dataset, null, 2));

        // Save to local directory
        const backupDir = path.join(os.homedir(), 'Desktop');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir); // Create the directory if it doesn't exist
        }

        const fileName = `backup-${new Date().toISOString().split('T')[0]}.json.gz`;
        const backupPath = path.join(backupDir, fileName);

        fs.writeFileSync(backupPath, compressedData);

        return `Backup saved to: ${backupPath}`;
    }

    /**
     * Schedule a backup at a specific interval.
     * @param intervalDays - The number of days between backups.
     */
    public async scheduleBackup(intervalDays: number): Promise<string> {
        if (this.backupInterval) {
            clearInterval(this.backupInterval); // Clear any existing interval
        }

        const intervalMilliseconds = intervalDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

        // Schedule the backup
        this.backupInterval = setInterval(async () => {
            console.log('Performing scheduled backup...');
            try {
                const backupPath = await this.createBackup();
                console.log(`Backup successful: ${backupPath}`);
            } catch (error) {
                console.error('Error during scheduled backup:', error);
            }
        }, intervalMilliseconds);

        // Perform an immediate backup
        await this.createBackup();
        return `Backup scheduled every ${intervalDays} day(s). Backup has been performed immediately.`;
    }

    /**
     * Stop the scheduled backup.
     */
    public stopBackupSchedule(): string {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
            this.backupInterval = null;
            return 'Backup schedule stopped.';
        }
        return 'No backup schedule is currently running.';
    }
}
