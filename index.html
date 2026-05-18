# -*- coding: utf-8 -*-
from __future__ import annotations

# 标准库
import json
import os
import re
import sqlite3
import traceback
from typing import Any, Dict, List, Optional, Set

# 第三方库
import pandas as pd
import requests

from rdflib import Graph, Literal, Namespace, URIRef
from rdflib.namespace import RDF, XSD
from rdflib.plugins.stores.sparqlstore import SPARQLStore


# =============================================================================
# RDF 命名空间
# =============================================================================

SCHEMA = Namespace("https://schema.org/")


# =============================================================================
# 数据实体类
# =============================================================================

class IdentifiableEntity:
    def __init__(self, id: str = ""):
        self._id: str = str(id).strip() if id else ""

    def getIds(self) -> List[str]:
        if not self._id:
            return []
        parts = [p.strip() for p in self._id.split(",") if p.strip()]
        return sorted(set(parts))

    def getId(self) -> str:
        ids = self.getIds()
        return ids[0] if ids else ""


class Area(IdentifiableEntity):
    def __init__(self, id: str = ""):
        super().__init__(id)

    def getIds(self) -> List[str]:
        return [self._id] if self._id else []


class Category(IdentifiableEntity):
    def __init__(self, id: str = "", quartile: Optional[str] = None):
        super().__init__(id)
        self._quartile: Optional[str] = quartile.strip().upper() if quartile and quartile.strip() else None

    def getQuartile(self) -> Optional[str]:
        return self._quartile

    def getIds(self) -> List[str]:
        return [self._id] if self._id else []


class Journal(IdentifiableEntity):
    def __init__(
        self,
        id: str = "",
        title: str = "",
        publisher: str = "",
        licence: str = "",
        apc: Optional[bool] = None,
        doaj_seal: Optional[bool] = None,
        languages: Optional[List[str]] = None,
    ):
        super().__init__(id)
        self._title     = str(title).strip()     if title     else ""
        self._publisher = str(publisher).strip() if publisher else ""
        self._licence   = str(licence).strip()   if licence   else ""
        self._apc       = apc
        self._doaj_seal = doaj_seal
        self._languages: List[str]   = list(languages) if languages else []
        self._categories: Dict[str, Category] = {}
        self._areas:      Dict[str, Area]     = {}

    def getTitle(self) -> str:
        return self._title

    def getPublisher(self) -> str:
        return self._publisher

    def getLicence(self) -> str:
        return self._licence

    def getLicense(self) -> str:
        return self._licence

    def getName(self) -> str:
        return self._title

    def hasAPC(self) -> bool:
        return bool(self._apc)

    def hasDOAJSeal(self) -> bool:
        return bool(self._doaj_seal)

    def getLanguages(self) -> List[str]:
        return list(self._languages)

    def getCategories(self) -> List[Category]:
        return list(self._categories.values())

    def getAreas(self) -> List[Area]:
        return list(self._areas.values())

    def addCategory(self, cat: Category) -> None:
        if cat and cat.getId():
            self._categories[cat.getId()] = cat

    def addArea(self, area: Area) -> None:
        if area and area.getId():
            self._areas[area.getId()] = area

    def getIds(self) -> List[str]:
        if not self._id:
            return []
        parts = [p.strip() for p in self._id.split(",") if p.strip()]
        issn_like = [p for p in parts if re.match(r'^\d{4}-[\dXx]{4}$', p)]
        return sorted(set(issn_like)) if issn_like else sorted(set(parts))


# =============================================================================
# Handler 基类
# =============================================================================

class Handler:
    def __init__(self):
        self.dbPathOrUrl: str = ""

    def getDbPathOrUrl(self) -> str:
        return self.dbPathOrUrl

    def setDbPathOrUrl(self, val: str) -> bool:
        self.dbPathOrUrl = str(val).strip()
        return True


class UploadHandler(Handler):
    def pushDataToDb(self, file_path: str) -> bool:
        raise NotImplementedError


class QueryHandler(Handler):
    def getById(self, id: str) -> pd.DataFrame:
        raise NotImplementedError


# =============================================================================
# Blazegraph 辅助类
# =============================================================================

def _bool_from_str(v: Any) -> Optional[bool]:
    if isinstance(v, bool):
        return v
    if isinstance(v, str):
        w = v.strip().lower()
        if w in {"true", "yes", "y", "1"}:
            return True
        if w in {"false", "no", "n", "0"}:
            return False
    return None


def _build_journal_uri(issn: str) -> URIRef:
    return URIRef(f"http://example.org/periodical/{issn}")


class _BlazegraphClient:
    def __init__(self, endpoint: str):
        self.endpoint = endpoint

    def upload_graph(self, g: Graph) -> bool:
        try:
            data = g.serialize(format="nt").encode("utf-8")
            resp = requests.post(
                self.endpoint,
                data=data,
                headers={"Content-Type": "text/plain; charset=utf-8"},
                timeout=120,
            )
            if resp.status_code in (200, 204):
                return True
            print(f"[WARN] Blazegraph upload returned {resp.status_code}: {resp.text[:200]}")
            return False
        except Exception as exc:
            print(f"[ERROR] upload_graph: {exc}")
            traceback.print_exc()
            return False

    def select(self, query: str) -> List[Dict[str, Any]]:
        try:
            store = SPARQLStore(self.endpoint)
            g = Graph(store=store)
            rows = []
            for row in g.query(query):
                binding = {var: (str(val) if val is not None else None)
                           for var, val in row.asdict().items()}
                rows.append(binding)
            return rows
        except Exception as exc:
            print(f"[ERROR] SPARQL select failed: {exc}")
            return []


# =============================================================================
# 期刊内存缓存（由 JournalUploadHandler 填充）
# =============================================================================

_JOURNAL_CACHE: Dict[str, pd.DataFrame] = {}

_EMPTY_JOURNAL_DF = pd.DataFrame(
    columns=["id", "title", "publisher", "licence", "apc", "doaj_seal", "languages"]
)


def _get_cache(endpoint: str) -> pd.DataFrame:
    return _JOURNAL_CACHE.get(endpoint, _EMPTY_JOURNAL_DF.copy())


def _set_cache(endpoint: str, df: pd.DataFrame) -> None:
    _JOURNAL_CACHE[endpoint] = df.reset_index(drop=True)


# =============================================================================
# JournalUploadHandler  –  CSV -> Blazegraph
# =============================================================================

class JournalUploadHandler(UploadHandler):
    def pushDataToDb(self, file_path: str) -> bool:
        try:
            if not os.path.isfile(file_path):
                print(f"[WARN] File not found: {file_path}")
                _set_cache(self.dbPathOrUrl, _EMPTY_JOURNAL_DF.copy())
                return False

            df_raw = pd.read_csv(file_path, dtype=str, keep_default_na=False)
            cols_lower = {c.lower(): c for c in df_raw.columns}

            def pick(*keys):
                for k in keys:
                    for low, orig in cols_lower.items():
                        if k in low:
                            return orig
                return None

            col_issn_p = pick("pissn", "print issn", "journal issn")
            col_issn_e = pick("eissn", "online issn", "electronic issn")
            col_title  = pick("title")
            col_pub    = pick("publisher")
            col_lic    = pick("license", "licence")
            col_apc    = pick("apc", "article processing")
            col_seal   = pick("seal", "doaj seal")
            col_lang   = pick("language")

            g = Graph()
            g.bind("schema", SCHEMA)
            cache_rows: List[Dict[str, Any]] = []

            for _, row in df_raw.iterrows():
                issn_parts: List[str] = []
                for col in [col_issn_p, col_issn_e]:
                    if col:
                        v = str(row[col]).strip()
                        if v and v.lower() not in ("", "nan", "none"):
                            issn_parts.append(v)
                seen: Set[str] = set()
                unique_issns: List[str] = []
                for i in issn_parts:
                    if i not in seen:
                        seen.add(i)
                        unique_issns.append(i)
                issn_parts = unique_issns

                primary_issn = issn_parts[0] if issn_parts else ""
                all_issns_str = ", ".join(issn_parts)

                title     = str(row[col_title]).strip()  if col_title else ""
                publisher = str(row[col_pub]).strip()    if col_pub   else ""
                licence   = str(row[col_lic]).strip()    if col_lic   else ""
                apc       = _bool_from_str(row[col_apc])  if col_apc   else None
                seal      = _bool_from_str(row[col_seal]) if col_seal  else None
                langs_raw = str(row[col_lang]).strip()   if col_lang  else ""
                languages = [l.strip() for l in langs_raw.split(", ") if l.strip()] if langs_raw else []

                if not primary_issn and not title:
                    continue

                cache_rows.append({
                    "id":        all_issns_str or title,
                    "title":     title,
                    "publisher": publisher,
                    "licence":   licence,
                    "apc":       apc,
                    "doaj_seal": seal,
                    "languages": languages,
                })

                if primary_issn:
                    s = _build_journal_uri(primary_issn)
                    g.add((s, RDF.type, SCHEMA.Periodical))
                    for issn_val in issn_parts:
                        g.add((s, SCHEMA.issn, Literal(issn_val)))
                    if title:
                        g.add((s, SCHEMA.name, Literal(title)))
                    if publisher:
                        g.add((s, SCHEMA.publisher, Literal(publisher)))
                    if licence:
                        g.add((s, SCHEMA.license, Literal(licence)))
                    for lang in languages:
                        g.add((s, SCHEMA.inLanguage, Literal(lang)))
                    if apc is not None:
                        pv = URIRef(str(s) + "#pv-apc")
                        g.add((s, SCHEMA.additionalProperty, pv))
                        g.add((pv, RDF.type, SCHEMA.PropertyValue))
                        g.add((pv, SCHEMA.name, Literal("APC")))
                        g.add((pv, SCHEMA.value, Literal(bool(apc), datatype=XSD.boolean)))
                    if seal is not None:
                        pv2 = URIRef(str(s) + "#pv-doaj-seal")
                        g.add((s, SCHEMA.additionalProperty, pv2))
                        g.add((pv2, RDF.type, SCHEMA.PropertyValue))
                        g.add((pv2, SCHEMA.name, Literal("DOAJSeal")))
                        g.add((pv2, SCHEMA.value, Literal(bool(seal), datatype=XSD.boolean)))

            _BlazegraphClient(self.dbPathOrUrl).upload_graph(g)
            _set_cache(self.dbPathOrUrl, pd.DataFrame.from_records(cache_rows))
            return True

        except Exception as exc:
            print(f"[ERROR] JournalUploadHandler.pushDataToDb: {exc}")
            traceback.print_exc()
            _set_cache(self.dbPathOrUrl, _EMPTY_JOURNAL_DF.copy())
            return False


# =============================================================================
# CategoryUploadHandler  –  JSON -> SQLite
# =============================================================================

class CategoryUploadHandler(UploadHandler):
    def pushDataToDb(self, file_path: str) -> bool:
        if not os.path.isfile(file_path):
            return False
        try:
            with open(file_path, "r", encoding="utf-8") as fh:
                data = json.load(fh)

            cat_rows:  List[Dict] = []
            area_rows: List[Dict] = []
            link_rows: List[Dict] = []

            for entry in data:
                identifiers: List[str] = [
                    str(i).strip()
                    for i in entry.get("identifiers", [])
                    if str(i).strip()
                ]
                categories = entry.get("categories", [])
                areas_raw  = entry.get("areas", [])
                current_areas = [str(a).strip() for a in areas_raw if str(a).strip()]

                for aid in current_areas:
                    area_rows.append({"id": aid})

                for cat in categories:
                    cid    = str(cat.get("id", "")).strip()
                    quart  = str(cat.get("quartile", "")).strip()
                    if not cid:
                        continue
                    cat_rows.append({"id": cid, "quartile": quart})

                    issn_list = identifiers if identifiers else [None]
                    for issn in issn_list:
                        if current_areas:
                            for aid in current_areas:
                                link_rows.append({
                                    "issn":     issn,
                                    "category": cid,
                                    "area":     aid,
                                    "quartile": quart,
                                })
                        else:
                            link_rows.append({
                                "issn":     issn,
                                "category": cid,
                                "area":     None,
                                "quartile": quart,
                            })

            conn = sqlite3.connect(self.dbPathOrUrl)
            (pd.DataFrame(cat_rows)
               .drop_duplicates(subset=["id", "quartile"])
               .to_sql("categories", conn, if_exists="replace", index=False))
            (pd.DataFrame(area_rows)
               .drop_duplicates()
               .to_sql("areas", conn, if_exists="replace", index=False))
            (pd.DataFrame(link_rows)
               .drop_duplicates()
               .to_sql("links", conn, if_exists="replace", index=False))
            conn.close()
            return True

        except Exception as exc:
            print(f"[ERROR] CategoryUploadHandler.pushDataToDb: {exc}")
            traceback.print_exc()
            return False


# =============================================================================
# JournalQueryHandler  –  查询 Blazegraph（本地缓存兜底）
# =============================================================================

class JournalQueryHandler(QueryHandler):
    def _cache(self) -> pd.DataFrame:
        return _get_cache(self.dbPathOrUrl)

    def _client(self) -> _BlazegraphClient:
        return _BlazegraphClient(self.dbPathOrUrl)

    @staticmethod
    def _merge_sparql_rows(rows: List[Dict[str, Any]]) -> pd.DataFrame:
        by_issn: Dict[str, Dict[str, Any]] = {}
        for r in rows:
            issn = r.get("issn") or ""
            if not issn:
                continue
            entry = by_issn.setdefault(issn, {
                "id":        issn,
                "title":     None,
                "publisher": None,
                "licence":   None,
                "apc":       None,
                "doaj_seal": None,
                "languages": [],
            })
            if r.get("title"):     entry["title"]     = r["title"]
            if r.get("publisher"): entry["publisher"] = r["publisher"]
            if r.get("licence"):   entry["licence"]   = r["licence"]
            if r.get("apc") is not None:
                v = str(r["apc"]).strip().lower()
                entry["apc"] = True if v in ("true", "1") else (False if v in ("false", "0") else None)
            if r.get("seal") is not None:
                v = str(r["seal"]).strip().lower()
                entry["doaj_seal"] = True if v in ("true", "1") else (False if v in ("false", "0") else None)
            lang = r.get("lang")
            if lang and lang not in entry["languages"]:
                entry["languages"].append(lang)
        df = pd.DataFrame.from_records(list(by_issn.values()))
        return df.reset_index(drop=True)

    def _sparql_query(self, extra_filter: str = "", limit: Optional[int] = None) -> pd.DataFrame:
        lim = f"LIMIT {limit}" if limit else ""
        query = f"""
        PREFIX schema: <https://schema.org/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?issn ?title ?publisher ?licence ?apc ?seal ?lang
        WHERE {{
            ?s a schema:Periodical ;
               schema:issn ?issn .
            OPTIONAL {{ ?s schema:name       ?title . }}
            OPTIONAL {{ ?s schema:publisher  ?publisher . }}
            OPTIONAL {{ ?s schema:license    ?licence . }}
            OPTIONAL {{ ?s schema:inLanguage ?lang . }}
            OPTIONAL {{
                ?s schema:additionalProperty ?pv1 .
                ?pv1 schema:name  "APC" .
                ?pv1 schema:value ?apc .
            }}
            OPTIONAL {{
                ?s schema:additionalProperty ?pv2 .
                ?pv2 schema:name  "DOAJSeal" .
                ?pv2 schema:value ?seal .
            }}
            {extra_filter}
        }}
        {lim}
        """
        rows = self._client().select(query)
        return self._merge_sparql_rows(rows)

    def _filter_cache(self, cache: pd.DataFrame, filter_type: str, value: Any = None) -> pd.DataFrame:
        df = cache.copy()
        if filter_type == "all":
            pass
        elif filter_type == "issn_exact":
            term = str(value).strip().lower()
            df = df[df["id"].astype(str).apply(
                lambda cell: any(p.strip().lower() == term for p in cell.split(","))
            )]
        elif filter_type == "title_contains":
            term = str(value).strip().lower()
            df = df[df["title"].astype(str).str.lower().str.contains(term, na=False)]
        elif filter_type == "publisher_contains":
            term = str(value).strip().lower()
            df = df[df["publisher"].astype(str).str.lower().str.contains(term, na=False)]
        elif filter_type == "license_in":
            lc_set = {str(l).strip().lower() for l in value}
            df = df[df["licence"].astype(str).str.strip().str.lower().isin(lc_set)]
        elif filter_type == "apc_true":
            df = df[df["apc"] == True]
        elif filter_type == "seal_true":
            df = df[df["doaj_seal"] == True]
        else:
            df = pd.DataFrame()
        return df.reset_index(drop=True)

    def _query(self, filter_type: str, value: Any = None,
               sparql_filter: str = "") -> pd.DataFrame:
        cache = self._cache()
        if not cache.empty:
            return self._filter_cache(cache, filter_type, value)
        df = self._sparql_query(sparql_filter)
        if filter_type != "all":
            df = self._filter_cache(df, filter_type, value)
        return df

    def getById(self, id: str) -> pd.DataFrame:
        return self._query(
            "issn_exact", id,
            sparql_filter=f'FILTER (LCASE(STR(?issn)) = LCASE("{id}"))',
        )

    def getAllJournals(self) -> pd.DataFrame:
        return self._query("all", sparql_filter="")

    def getJournalsWithTitle(self, partial_title: str) -> pd.DataFrame:
        return self._query(
            "title_contains", partial_title,
            sparql_filter=f'FILTER (BOUND(?title) && CONTAINS(LCASE(STR(?title)), LCASE("{partial_title}")))',
        )

    def getJournalsPublishedBy(self, partial_name: str) -> pd.DataFrame:
        return self._query(
            "publisher_contains", partial_name,
            sparql_filter=f'FILTER (BOUND(?publisher) && CONTAINS(LCASE(STR(?publisher)), LCASE("{partial_name}")))',
        )

    def getJournalsWithLicense(self, licenses: Set[str]) -> pd.DataFrame:
        if not licenses:
            return self.getAllJournals()
        return self._query(
            "license_in", licenses,
            sparql_filter=(
                "FILTER (BOUND(?licence) && ("
                + " || ".join(f'LCASE(STR(?licence)) = LCASE("{l}")' for l in licenses)
                + "))"
            ),
        )

    def getJournalsWithAPC(self) -> pd.DataFrame:
        return self._query(
            "apc_true",
            sparql_filter='FILTER (BOUND(?apc) && STR(?apc) = "true")',
        )

    def getJournalsWithDOAJSeal(self) -> pd.DataFrame:
        return self._query(
            "seal_true",
            sparql_filter='FILTER (BOUND(?seal) && STR(?seal) = "true")',
        )


# =============================================================================
# CategoryQueryHandler  –  查询 SQLite
# =============================================================================

class CategoryQueryHandler(QueryHandler):
    def _conn(self) -> sqlite3.Connection:
        return sqlite3.connect(self.dbPathOrUrl)

    def _sql(self, query: str, params: tuple = ()) -> pd.DataFrame:
        try:
            conn = self._conn()
            df = pd.read_sql_query(query, conn, params=params)
            conn.close()
            return df
        except Exception as exc:
            print(f"[ERROR] CategoryQueryHandler SQL: {exc}")
            return pd.DataFrame()

    def _links(self) -> pd.DataFrame:
        return self._sql("SELECT * FROM links")

    def getById(self, id: str) -> pd.DataFrame:
        df = self._sql("SELECT id, quartile FROM categories WHERE id = ?", (id,))
        if not df.empty:
            return df
        df = self._sql("SELECT id FROM areas WHERE id = ?", (id,))
        return df

    def getAllCategories(self) -> pd.DataFrame:
        df = self._sql("SELECT id, MIN(quartile) AS quartile FROM categories GROUP BY id")
        return df.drop_duplicates(subset=["id"]).reset_index(drop=True)

    def getAllAreas(self) -> pd.DataFrame:
        df = self._sql("SELECT DISTINCT id FROM areas")
        return df.drop_duplicates().reset_index(drop=True)

    def getCategoriesWithQuartile(self, quartiles: Set[str]) -> pd.DataFrame:
        if not quartiles:
            return self.getAllCategories()
        wanted = {q.strip().upper() for q in quartiles}
        df_all = self._sql("SELECT id, quartile FROM categories")
        if df_all.empty:
            return pd.DataFrame()
        mask = df_all["quartile"].astype(str).str.strip().str.upper().isin(wanted)
        return (
            df_all.loc[mask]
            .drop_duplicates(subset=["id"])
            .reset_index(drop=True)
        )

    def getCategoriesAssignedToAreas(self, area_ids: Set[str]) -> pd.DataFrame:
        ldf = self._links()
        if ldf.empty:
            return pd.DataFrame(columns=["id", "quartile"])
        if area_ids:
            norm = {a.strip().lower() for a in area_ids}
            ldf = ldf[ldf["area"].astype(str).str.strip().str.lower().isin(norm)]
        cats = ldf[ldf["category"].notna()][["category", "quartile"]].copy()
        cats = cats.rename(columns={"category": "id"})
        return cats.drop_duplicates(subset=["id"]).reset_index(drop=True)

    def getAreasAssignedToCategories(self, category_ids: Set[str]) -> pd.DataFrame:
        ldf = self._links()
        if ldf.empty:
            return pd.DataFrame(columns=["id"])
        if category_ids:
            norm = {c.strip().lower() for c in category_ids}
            ldf = ldf[ldf["category"].astype(str).str.strip().str.lower().isin(norm)]
        areas = ldf[ldf["area"].notna()][["area"]].copy()
        areas = areas.rename(columns={"area": "id"})
        return areas.drop_duplicates().reset_index(drop=True)


# =============================================================================
# BasicQueryEngine
# =============================================================================

class BasicQueryEngine:
    def __init__(self):
        self.journalQuery:  List[JournalQueryHandler]  = []
        self.categoryQuery: List[CategoryQueryHandler] = []

    def cleanJournalHandlers(self) -> bool:
        self.journalQuery.clear()
        return True

    def cleanCategoryHandlers(self) -> bool:
        self.categoryQuery.clear()
        return True

    def addJournalHandler(self, handler: JournalQueryHandler) -> bool:
        if handler and handler not in self.journalQuery:
            self.journalQuery.append(handler)
            return True
        return False

    def addCategoryHandler(self, handler: CategoryQueryHandler) -> bool:
        if handler and handler not in self.categoryQuery:
            self.categoryQuery.append(handler)
            return True
        return False

    @staticmethod
    def _combine_dfs(frames: List[pd.DataFrame]) -> pd.DataFrame:
        valid = [f for f in frames if isinstance(f, pd.DataFrame) and not f.empty]
        if not valid:
            return pd.DataFrame()
        df = pd.concat(valid, ignore_index=True)
        list_cols = [c for c in df.columns if df[c].apply(lambda v: isinstance(v, list)).any()]
        for c in list_cols:
            df[c] = df[c].apply(lambda v: json.dumps(v, ensure_ascii=False) if isinstance(v, list) else v)
        df = df.drop_duplicates(ignore_index=True)
        for c in list_cols:
            df[c] = df[c].apply(lambda v: json.loads(v) if isinstance(v, str) and v.startswith("[") else v)
        return df

    def _parse_languages(self, val: Any) -> List[str]:
        if isinstance(val, list):
            return [v.strip() for v in val if isinstance(v, str) and v.strip()]
        if isinstance(val, str):
            return [v.strip() for v in val.split(", ") if v.strip()]
        return []

    def _row_to_journal(self, row: pd.Series) -> Journal:
        raw_id = str(row.get("id", "")).strip()
        return Journal(
            id=raw_id,
            title=str(row.get("title", "")).strip(),
            publisher=str(row.get("publisher", "")).strip(),
            licence=str(row.get("licence", "")).strip(),
            apc=self._coerce_bool(row.get("apc")),
            doaj_seal=self._coerce_bool(row.get("doaj_seal")),
            languages=self._parse_languages(row.get("languages")),
        )

    @staticmethod
    def _coerce_bool(val: Any) -> Optional[bool]:
        if isinstance(val, bool):
            return val
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return None
        s = str(val).strip().lower()
        if s in {"true", "yes", "1", "t", "y"}:
            return True
        if s in {"false", "no", "0", "f", "n", ""}:
            return False
        return None

    def _df_to_journals(self, df: pd.DataFrame) -> List[Journal]:
        if df is None or df.empty:
            return []
        if "id" in df.columns:
            df = df.drop_duplicates(subset=["id"]).reset_index(drop=True)
        return [self._row_to_journal(row) for _, row in df.iterrows()]

    def _df_to_categories(self, df: pd.DataFrame) -> List[Category]:
        if df is None or df.empty:
            return []
        id_col = "id" if "id" in df.columns else (
            "category_id" if "category_id" in df.columns else None
        )
        if id_col is None:
            return []
        seen: Set[str] = set()
        result: List[Category] = []
        for _, row in df.iterrows():
            cid = str(row[id_col]).strip()
            if not cid or cid in seen:
                continue
            seen.add(cid)
            q = row.get("quartile", None)
            result.append(Category(id=cid, quartile=q if q and str(q).strip() else None))
        return result

    def _df_to_areas(self, df: pd.DataFrame) -> List[Area]:
        if df is None or df.empty:
            return []
        id_col = "id" if "id" in df.columns else (
            "area_id" if "area_id" in df.columns else None
        )
        if id_col is None:
            return []
        seen: Set[str] = set()
        result: List[Area] = []
        for _, row in df.iterrows():
            aid = str(row[id_col]).strip()
            if not aid or aid in seen:
                continue
            seen.add(aid)
            result.append(Area(id=aid))
        return result

    def getEntityById(self, identifier: str) -> Optional[IdentifiableEntity]:
        if not identifier:
            return None
        target = str(identifier).strip()

        for h in self.journalQuery:
            try:
                df = h.getById(target)
                if isinstance(df, pd.DataFrame) and not df.empty:
                    j = self._row_to_journal(df.iloc[0])
                    for issn in j.getIds():
                        for ch in self.categoryQuery:
                            try:
                                ldf = ch._links()
                                if ldf.empty:
                                    continue
                                norm_issn = issn.strip().lower()
                                matching = ldf[
                                    ldf["issn"].astype(str).str.strip().str.lower() == norm_issn
                                ]
                                for cat_id in matching["category"].dropna().unique():
                                    q_rows = matching.loc[
                                        matching["category"] == cat_id, "quartile"
                                    ].dropna()
                                    q_val = q_rows.iloc[0] if not q_rows.empty else None
                                    j.addCategory(Category(id=str(cat_id), quartile=q_val))
                                for area_id in matching["area"].dropna().unique():
                                    j.addArea(Area(id=str(area_id)))
                            except Exception:
                                pass
                    return j
            except Exception:
                pass

        for h in self.categoryQuery:
            try:
                df = h.getAllCategories()
                if not df.empty:
                    id_col = "id" if "id" in df.columns else "category_id"
                    row = df[df[id_col].astype(str).str.strip() == target]
                    if not row.empty:
                        q = row.iloc[0].get("quartile", None)
                        return Category(id=target, quartile=q if q and str(q).strip() else None)
            except Exception:
                pass

        for h in self.categoryQuery:
            try:
                df = h.getAllAreas()
                if not df.empty:
                    id_col = "id" if "id" in df.columns else "area_id"
                    row = df[df[id_col].astype(str).str.strip() == target]
                    if not row.empty:
                        return Area(id=target)
            except Exception:
                pass

        return None

    def getAllJournals(self) -> List[Journal]:
        df = self._combine_dfs([h.getAllJournals() for h in self.journalQuery])
        return self._df_to_journals(df)

    def getJournalsWithTitle(self, partial_title: str) -> List[Journal]:
        df = self._combine_dfs([h.getJournalsWithTitle(partial_title) for h in self.journalQuery])
        return self._df_to_journals(df)

    def getJournalsPublishedBy(self, partial_name: str) -> List[Journal]:
        df = self._combine_dfs([h.getJournalsPublishedBy(partial_name) for h in self.journalQuery])
        return self._df_to_journals(df)

    def getJournalsWithLicense(self, licenses: Set[str]) -> List[Journal]:
        df = self._combine_dfs([h.getJournalsWithLicense(licenses) for h in self.journalQuery])
        return self._df_to_journals(df)

    def getJournalsWithAPC(self) -> List[Journal]:
        df = self._combine_dfs([h.getJournalsWithAPC() for h in self.journalQuery])
        return self._df_to_journals(df)

    def getJournalsWithDOAJSeal(self) -> List[Journal]:
        df = self._combine_dfs([h.getJournalsWithDOAJSeal() for h in self.journalQuery])
        return self._df_to_journals(df)

    def getAllCategories(self) -> List[Category]:
        df = self._combine_dfs([h.getAllCategories() for h in self.categoryQuery])
        return self._df_to_categories(df)

    def getAllAreas(self) -> List[Area]:
        df = self._combine_dfs([h.getAllAreas() for h in self.categoryQuery])
        return self._df_to_areas(df)

    def getCategoriesWithQuartile(self, quartiles: Set[str]) -> List[Category]:
        df = self._combine_dfs([h.getCategoriesWithQuartile(quartiles) for h in self.categoryQuery])
        return self._df_to_categories(df)

    def getCategoriesAssignedToAreas(self, area_ids: Set[str]) -> List[Category]:
        df = self._combine_dfs([h.getCategoriesAssignedToAreas(area_ids) for h in self.categoryQuery])
        return self._df_to_categories(df)

    def getAreasAssignedToCategories(self, category_ids: Set[str]) -> List[Area]:
        df = self._combine_dfs([h.getAreasAssignedToCategories(category_ids) for h in self.categoryQuery])
        return self._df_to_areas(df)


# =============================================================================
# FullQueryEngine  –  跨源聚合查询
# =============================================================================

class FullQueryEngine(BasicQueryEngine):
    def _all_links(self) -> pd.DataFrame:
        frames = [h._links() for h in self.categoryQuery if isinstance(h, CategoryQueryHandler)]
        return self._combine_dfs(frames)

    def _all_journals_df(self) -> pd.DataFrame:
        return self._combine_dfs([h.getAllJournals() for h in self.journalQuery])

    def _issns_for_categories_quartiles(
        self, category_ids: Set[str], quartiles: Set[str]
    ) -> Set[str]:
        ldf = self._all_links()
        if ldf.empty:
            return set()

        norm_cats = {c.strip().lower() for c in category_ids} if category_ids else None
        norm_qs   = {q.strip().upper() for q in quartiles}   if quartiles   else None

        mask = pd.Series([True] * len(ldf), index=ldf.index)
        if norm_cats is not None:
            mask &= ldf["category"].astype(str).str.strip().str.lower().isin(norm_cats)
        if norm_qs is not None:
            mask &= ldf["quartile"].astype(str).str.strip().str.upper().isin(norm_qs)

        matched = ldf.loc[mask, "issn"].dropna().astype(str).str.strip()
        return {v for v in matched if v}

    def _issns_for_areas(self, area_ids: Set[str]) -> Set[str]:
        ldf = self._all_links()
        if ldf.empty:
            return set()

        norm_areas = {a.strip().lower() for a in area_ids} if area_ids else None

        mask = pd.Series([True] * len(ldf), index=ldf.index)
        if norm_areas is not None:
            mask &= ldf["area"].astype(str).str.strip().str.lower().isin(norm_areas)

        matched = ldf.loc[mask, "issn"].dropna().astype(str).str.strip()
        return {v for v in matched if v}

    def _journals_with_issns(
        self, jdf: pd.DataFrame, issn_set: Set[str]
    ) -> List[Journal]:
        if jdf.empty or not issn_set:
            return []
        norm_issns = {i.strip().lower() for i in issn_set}

        def row_matches(cell: str) -> bool:
            return any(
                p.strip().lower() in norm_issns
                for p in str(cell).split(",")
            )

        mask = jdf["id"].apply(row_matches)
        matched = jdf.loc[mask].drop_duplicates(subset=["id"]).reset_index(drop=True)
        return self._df_to_journals(matched)

    def getJournalsInCategoriesWithQuartile(
        self, categories: Set[str], quartiles: Set[str]
    ) -> List[Journal]:
        issns = self._issns_for_categories_quartiles(categories, quartiles)
        if not issns:
            return []
        jdf = self._all_journals_df()
        return self._journals_with_issns(jdf, issns)

    def getJournalsInAreasWithLicense(
        self, areas: Set[str], licenses: Set[str]
    ) -> List[Journal]:
        area_issns = self._issns_for_areas(areas)
        if not area_issns and areas:
            return []

        lic_frames = [h.getJournalsWithLicense(licenses) for h in self.journalQuery]
        lic_df = self._combine_dfs(lic_frames)
        if lic_df.empty:
            return []

        if area_issns:
            return self._journals_with_issns(lic_df, area_issns)
        else:
            return self._df_to_journals(lic_df)

    def getDiamondJournalsInAreasAndCategoriesWithQuartile(
        self, areas: Set[str], categories: Set[str], quartiles: Set[str]
    ) -> List[Journal]:
        # 标记用户是否真正传入了过滤条件
        has_area_filter = bool(areas)
        has_catq_filter = bool(categories or quartiles)

        area_issns = self._issns_for_areas(areas)
        catq_issns = self._issns_for_categories_quartiles(categories, quartiles)

        # 若用户明确传了条件但查不到任何匹配ISSN，说明条件不命中，直接返回空
        if has_area_filter and not area_issns:
            return []
        if has_catq_filter and not catq_issns:
            return []

        # 组合ISSN集合：按用户实际传入的条件进行交集/并集
        if has_area_filter and has_catq_filter:
            combined_issns = area_issns.intersection(catq_issns)
        elif has_area_filter:
            combined_issns = area_issns
        elif has_catq_filter:
            combined_issns = catq_issns
        else:
            combined_issns = set()

        jdf = self._all_journals_df()
        if jdf.empty:
            return []

        # 核心修复：区分「用户传了条件但交集为空（应返回[]）」
        # 与「用户没传任何条件（应返回全部）」
        if has_area_filter or has_catq_filter:
            # 用户至少传了一个条件，用组合后的ISSN严格过滤
            journals = self._journals_with_issns(jdf, combined_issns)
        else:
            # 用户未传任何条件，返回全部期刊
            journals = self._df_to_journals(jdf)

        return [j for j in journals if j._apc is False]
