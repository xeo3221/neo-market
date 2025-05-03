import {
  getUserData,
  getCardsData,
  getInventoryData,
  getTransactionsData,
  getCardData,
} from "./data";

global.fetch = jest.fn();

describe("API Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserData", () => {
    it("powinien zwrócić dane użytkownika przy poprawnym responsie", async () => {
      const mockUserData = { id: "1", name: "Test User" };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      });

      const result = await getUserData();
      expect(result).toEqual(mockUserData);
      expect(fetch).toHaveBeenCalledWith("/server/api/user");
    });

    it("powinien rzucić błąd przy niepoprawnym responsie", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getUserData()).rejects.toThrow("Failed to fetch user data");
    });

    it("powinien rzucić błąd przy błędzie sieci", async () => {
      const error = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(getUserData()).rejects.toBe(error);
    });
  });

  describe("getCardsData", () => {
    it("powinien zwrócić dane kart przy poprawnym responsie", async () => {
      const mockCardsData = [{ id: "1", name: "Test Card" }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCardsData),
      });

      const result = await getCardsData();
      expect(result).toEqual(mockCardsData);
      expect(fetch).toHaveBeenCalledWith("/server/api/cards");
    });

    it("powinien rzucić błąd przy niepoprawnym responsie", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getCardsData()).rejects.toThrow("Failed to fetch cards");
    });

    it("powinien rzucić błąd przy błędzie sieci", async () => {
      const error = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(getCardsData()).rejects.toBe(error);
    });
  });

  describe("getInventoryData", () => {
    it("powinien zwrócić dane inwentarza przy poprawnym responsie", async () => {
      const mockInventoryData = [{ id: "1", name: "Test Item" }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInventoryData),
      });

      const result = await getInventoryData();
      expect(result).toEqual(mockInventoryData);
      expect(fetch).toHaveBeenCalledWith("/server/api/inventory");
    });

    it("powinien rzucić błąd przy niepoprawnym responsie", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getInventoryData()).rejects.toThrow(
        "Failed to fetch inventory"
      );
    });

    it("powinien rzucić błąd przy błędzie sieci", async () => {
      const error = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(getInventoryData()).rejects.toBe(error);
    });
  });

  describe("getTransactionsData", () => {
    it("powinien zwrócić dane transakcji przy poprawnym responsie", async () => {
      const mockTransactionsData = [{ id: "1", amount: 100 }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTransactionsData),
      });

      const result = await getTransactionsData();
      expect(result).toEqual(mockTransactionsData);
      expect(fetch).toHaveBeenCalledWith("/server/api/transactions");
    });

    it("powinien rzucić błąd przy niepoprawnym responsie", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getTransactionsData()).rejects.toThrow(
        "Failed to fetch transactions"
      );
    });

    it("powinien rzucić błąd przy błędzie sieci", async () => {
      const error = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(getTransactionsData()).rejects.toBe(error);
    });
  });

  describe("getCardData", () => {
    it("powinien zwrócić dane karty przy poprawnym responsie", async () => {
      const cardId = "123";
      const mockCardData = { id: cardId, name: "Test Card" };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCardData),
      });

      const result = await getCardData(cardId);
      expect(result).toEqual(mockCardData);
      expect(fetch).toHaveBeenCalledWith(`/server/api/cards/${cardId}`);
    });

    it("powinien rzucić błąd przy niepoprawnym responsie", async () => {
      const cardId = "123";
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getCardData(cardId)).rejects.toThrow(
        "Failed to fetch card data"
      );
    });

    it("powinien rzucić błąd przy błędzie sieci", async () => {
      const cardId = "123";
      const error = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(getCardData(cardId)).rejects.toBe(error);
    });
  });
});
