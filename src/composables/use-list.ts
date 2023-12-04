import { ref } from 'vue';
import { Http } from '@/tools/http';

export type UseListOptions = {
  url: string;
  pageNoProperty?: string;
  pageSizeProperty?: string;
  pageNo?: number;
  pageSize?: number;
  listPath?: string;
  totalPath?: string;
  itemFormatter?: (item: any) => any;
  [k: string]: any;
};

function getValue(key: string, data: { [k: string]: any }) {
  let value: any = undefined;
  key.split('.').forEach((k: string) => {
    value = value ? value[k] : data[k];
  });
  return value;
}

export function useList<Item>(options: UseListOptions) {
  const http = Http.getInstance();
  const url = options.url;
  const pageNoProperty = options.pageNoProperty || 'page';
  const pageSizeProperty = options.pageNoProperty || 'size';
  const listPath = options.listPath || 'pageInfo.list';
  const totalPath = options.totalPath || 'pageInfo.total';
  const initPageNo = options.pageNo || 1;
  const initPageSize = options.pageSize || 10;

  const list = ref<Item[]>([]);
  const loading = ref(true);
  const pageNo = ref(initPageNo);
  const pageSize = ref(initPageSize);
  const queryParams = ref<any>({});
  const pageCount = ref(1);
  const itemCount = ref(0);

  const updateList = async () => {
    loading.value = true;
    const resp = await http.get({
      url: url,
      data: { [pageNoProperty]: pageNo.value, [pageSizeProperty]: pageSize.value, ...queryParams.value },
    });
    loading.value = false;

    const newList: any[] = getValue(listPath, resp) || [];
    const total = getValue(totalPath, resp) || 0;

    list.value = options.itemFormatter ? newList.map(options.itemFormatter) : newList;
    itemCount.value = total;
    pageCount.value = Math.ceil(total / pageSize.value);
  };

  const initList = async () => {
    pageNo.value = 1;
    return updateList();
  };

  return {
    list,
    loading,
    pageNo,
    pageSize,
    queryParams,
    pageCount,
    itemCount,
    initList,
    updateList,
  };
}
