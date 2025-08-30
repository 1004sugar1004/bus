
import { GoogleGenAI, Type } from "@google/genai";
import type { Terminal, BusSchedule } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContentWithRetry = async <T,>(prompt: string, schema: any): Promise<T> => {
    let retries = 3;
    while (retries > 0) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            const jsonText = response.text.trim();
            return JSON.parse(jsonText) as T;
        } catch (error) {
            console.error("Gemini API call failed, retrying...", error);
            retries--;
            if (retries === 0) {
                throw new Error("Failed to fetch data from Gemini API after multiple retries.");
            }
            await new Promise(res => setTimeout(res, 1000));
        }
    }
    throw new Error("Should not be reached");
};


export const fetchTerminals = async (): Promise<Terminal[]> => {
  const prompt = `대한민국의 주요 고속버스 터미널 15곳의 목록을 JSON 형식으로 제공해줘. 각 터미널은 'name' (예: "서울경부")과 'code' (예: "SEL") 키를 가져야 해. 코드는 임의의 3자리 영문 대문자로 생성해줘.`;
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "터미널 이름" },
        code: { type: Type.STRING, description: "터미널 코드 (3자리 영문)" },
      },
      required: ["name", "code"],
    },
  };

  return generateContentWithRetry<Terminal[]>(prompt, schema);
};

export const fetchSchedules = async (departure: string, arrival: string, date: string): Promise<BusSchedule[]> => {
  const prompt = `${date}에 ${departure}에서 ${arrival}으로 가는 고속버스 운행 스케줄 10개를 현실적인 데이터로 생성해줘. 
  다음 JSON 형식에 맞춰서 응답해줘.
  - company: 고속버스 회사 이름 (예: "중앙고속", "금호고속")
  - grade: '프리미엄', '우등', '일반' 중 하나
  - departureTime: "HH:MM" 형식의 출발 시간
  - arrivalTime: "HH:MM" 형식의 도착 시간
  - duration: "X시간 Y분" 형식의 소요 시간
  - price: 숫자 형태의 요금 (20000에서 50000 사이)
  - totalSeats: 총 좌석 수 (프리미엄 21, 우등 28, 일반 45)
  - availableSeats: 남은 좌석 수 (총 좌석 수보다 작거나 같은 임의의 숫자)
  
  결과는 출발 시간 순서대로 정렬해줘.`;
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        company: { type: Type.STRING, description: "고속버스 회사" },
        grade: { type: Type.STRING, enum: ['프리미엄', '우등', '일반'] },
        departureTime: { type: Type.STRING, description: "출발 시간 (HH:MM)" },
        arrivalTime: { type: Type.STRING, description: "도착 시간 (HH:MM)" },
        duration: { type: Type.STRING, description: "소요 시간" },
        price: { type: Type.NUMBER, description: "요금" },
        totalSeats: { type: Type.NUMBER, description: "총 좌석 수" },
        availableSeats: { type: Type.NUMBER, description: "잔여 좌석 수" },
      },
      required: ["company", "grade", "departureTime", "arrivalTime", "duration", "price", "totalSeats", "availableSeats"],
    },
  };

  return generateContentWithRetry<BusSchedule[]>(prompt, schema);
};
