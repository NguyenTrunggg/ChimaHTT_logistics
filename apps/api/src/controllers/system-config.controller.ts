import { Request, Response } from "express";
import * as systemConfigService from "../services/system-config.service";

export const listConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await systemConfigService.listConfigs();
    res.json(configs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const config = await systemConfigService.getConfig(key);
    if (!config) return res.status(404).json({ message: "Not found" });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createConfig = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const config = await systemConfigService.createConfig(key, value);
    res.status(201).json(config);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const config = await systemConfigService.updateConfig(key, value);
    res.json(config);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    await systemConfigService.deleteConfig(key);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const testApiKey = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ 
        message: "Both 'key' and 'value' are required",
        valid: false 
      });
    }

    // Validate the API key format first
    if (!value.startsWith("AIza") || value.length < 35) {
      return res.status(400).json({ 
        message: "Invalid API key format",
        valid: false 
      });
    }

    const isValid = await systemConfigService.testGeminiApiKey(value);
    
    res.json({ 
      valid: isValid,
      message: isValid ? "API key is valid" : "API key is invalid or expired",
      key
    });
  } catch (error: any) {
    console.error("Test API key error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to test API key",
      valid: false 
    });
  }
};
