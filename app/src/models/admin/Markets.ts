export interface Markets {
    market_id: number;
    market: string;
    parent_id: number | null;
    lon: number;
    lat: number;
    has_child: '0' | '1' | null;
  }