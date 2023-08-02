export const FUNCTION = {
  get_main_data_list: (list) => {
    console.log(list)
    const mainList = list.filter(item => item.isMain)
    return mainList
  }
}