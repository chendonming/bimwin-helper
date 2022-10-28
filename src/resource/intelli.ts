import { Suggestion } from "../app";

const ip = 'http://172.18.1.234:8380/'

export const attribute: Suggestion = {
  "pit-bim-win-ui": [
    {
      label: "options",
      description: "bimwin - 配置项"
    },
    {
      label: "headers",
      description: "bimwin - 请求头"
    },
    {
      label: "visibleToolbar",
      description: "bimwin - 可见的菜单栏"
    },
    {
      label: "hiddenToolbar",
      description: "bimwin - 需要隐藏的菜单栏"
    },
    {
      label: "customToolbar",
      description: "bimwin - 自定义菜单栏"
    },
    {
      label: "menuRight",
      description: "bimwin - 自定义菜单右键"
    },
    {
      label: "debugUI",
      description: "bimwin - 开启Debug视图"
    }
  ]
}

export const method: Suggestion = {
  "pit-bim-win-ui": [
    {
      label: "getSelectNodesProperties",
      description: "获取选中构件属性"
    },
    {
      label: "getPropertiesByNodesIds",
      description: "根据ids获取构件属性"
    },
    {
      label: "getClickNodeId",
      description: "获取选中构件id"
    },
    {
      label: "setNodesColor",
      description: "设置构件颜色"
    },
    {
      label: "setNodesColorAndOpacity",
      description: "设置构件颜色，透明度，是否穿透"
    },
    {
      label: "setNodesBlink",
      description: "设置构件闪烁"
    },
    {
      label: "focusNodes",
      description: "聚焦构件"
    },
    {
      label: "getNodeInfoById",
      description: "根据id获取构件详情"
    },
    {
      label: "getView",
      description: "获取当前视角信息"
    },
    {
      label: "setView",
      description: "设置视角"
    },
    {
      label: "resetView",
      description: "重置主视角"
    },
    {
      label: "importLabelData",
      description: "导入标签数据以还原标签"
    },
    {
      label: "clearAllLabel",
      description: "清除所有标签"
    },
    {
      label: "setCSSVar",
      description: "自定义css变量"
    },
  ]
}

export const hoverDoc: Suggestion = {
  getSelectNodesProperties: `### getSelectNodesProperties\n 获取选中构件属性 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  getPropertiesByNodesIds: `### getPropertiesByNodesIds(ids: string[])\n 根据ids获取构件属性 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  getClickNodeId: `### getClickNodeId()\n 获取选中构件id \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  setNodesColor: `### setNodesColor(ids: string[], color: string|number)\n 设置构件颜色 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  setNodesColorAndOpacity: `### setNodesColorAndOpacity(ids: string[], color: string|number, opacity: number, bool: boolean)\n 设置构件颜色，透明度，是否穿透 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  setNodesBlink: `### setNodesBlink(ids: string[], color: string|number, time: number)\n 设置构件闪烁 \n speed 代表速度, 默认值 0.005, 构件透明度会在[0.2, 0.9]之间有节奏的转换, speed代表每次转换时的最大影响值 \n ${ip}pitBimWinUi/pitBimWinUi.html#setnodesblink-说明`,
  focusNodes: `### focusNodes(ids: string[])\n 聚焦构件 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  getNodeInfoById: `### getNodeInfoById(id: string)\n 根据id获取构件详情 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  getView: `### getView()\n 获取当前视角信息 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  setView: `### setView(viewData: viewData)\n 设置视角 \n #### 相机参数信息 \n | 值       | 类型          | 描述           |
  | -------- | ------------- | -------------- |
  | position | THREE.Vector3 | 位置(3D)       |
  | rotation | THREE.Euler   | 欧拉角(3D)     |
  | left     | number        | 左侧面位置(2D) |
  | top      | number        | 上侧面位置(2D) |
  | right    | number        | 右侧面位置(2D) |
  | bottom   | number        | 下侧面位置(2D) | \n\n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  resetView: `### resetView()\n 重置主视角 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  importLabelData: `### importLabelData(data)\n 导入标签数据以还原标签 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  clearAllLabel: `### clearAllLabel()\n 清除所有标签 \n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
  setCSSVar: `### setCSSVar(name: string, value: string)\n 自定义css变量 \n | 变量名                              | 描述                  |
  | ----------------------------------- | --------------------- |
  | --pit-bim-win-toolbar-primary-color | 底部导航栏背景色      |
  | --pit-bim-win-toolbar-border-radius | 底部导航栏边框 radius |
  | --pit-bim-win-dialog-primary-color  | 弹窗 body 背景颜色    |
  | --pit-bim-win-dialog-border-color   | 弹窗边框颜色          |
  | --pit-bim-win-dialog-font-color     | 弹窗字体颜色          |
  | --pit-bim-win-dialog-header-color   | 弹窗头部颜色          |
  | --pit-bim-win-dialog-border-radius  | 弹窗边框 radius       | \n\n ${ip}pitBimWinUi/pitBimWinUi.html#方法`,
}