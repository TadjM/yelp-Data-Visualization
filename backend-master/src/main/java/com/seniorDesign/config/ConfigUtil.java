package com.seniorDesign.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

class ConfigUtil {
    private static final Logger logger = LoggerFactory.getLogger(ConfigUtil.class);

    /**
     * Downloads data from {@code url} and returns a byte array representing the data downloaded.
     *
     * @param url The url from which we should download.
     * @return A byte array representing the downloaded data.
     * @throws IOException
     */
    static byte[] getCloudData(URL url) throws IOException {
        logger.info("Downloading from " + url);

        // Temporary file to hold downloaded data.
        Path tmpPath = Files.createTempFile("seniordesignbackend", "data_from_cloud.json");

        // Download and store data into temporary file.
        byte dataBuffer[] = new byte[1024];
        int bytesRead;
        BufferedInputStream in = new BufferedInputStream(url.openStream());
        FileOutputStream fileOutputStream = new FileOutputStream(tmpPath.toString());

        while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
            fileOutputStream.write(dataBuffer, 0, bytesRead);
        }

        byte[] cloudData = Files.readAllBytes(tmpPath.toAbsolutePath());
        Files.deleteIfExists(tmpPath);

        logger.info("Successfully read " + cloudData.length + " bytes of data from " + url);
        return cloudData;
    }
}
