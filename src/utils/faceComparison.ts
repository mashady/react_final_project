export interface FaceComparisonResult {
  same_person: boolean;
  confidence?: number;
  distance?: number;
  faces_detected?: {
    image1: number;
    image2: number;
  };
  error?: string;
}

export class FaceComparisonService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:5000") {
    this.baseUrl = baseUrl;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async compareFacesBase64(
    image1Base64: string,
    image2Base64: string,
    tolerance: number = 0.6
  ): Promise<FaceComparisonResult> {
    try {
      const response = await fetch(`${this.baseUrl}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image1: image1Base64,
          image2: image2Base64,
          tolerance,
        }),
      });
      return await response.json();
    } catch (error) {
      return {
        same_person: false,
        error: `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async compareFacesFiles(
    image1: File,
    image2: File,
    tolerance: number = 0.6
  ): Promise<FaceComparisonResult> {
    try {
      const image1Base64 = await this.fileToBase64(image1);
      const image2Base64 = await this.fileToBase64(image2);
      return await this.compareFacesBase64(
        image1Base64,
        image2Base64,
        tolerance
      );
    } catch (error) {
      return {
        same_person: false,
        error: `File processing error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async compareFacesFormData(
    image1: File,
    image2: File,
    tolerance: number = 0.6
  ): Promise<FaceComparisonResult> {
    try {
      const formData = new FormData();
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("tolerance", tolerance.toString());
      const response = await fetch(`${this.baseUrl}/compare-files`, {
        method: "POST",
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return {
        same_person: false,
        error: `Upload error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
