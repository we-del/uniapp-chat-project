if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var isVue2 = false;
  function set(target2, key, val) {
    if (Array.isArray(target2)) {
      target2.length = Math.max(target2.length, key);
      target2.splice(key, 1, val);
      return val;
    }
    target2[key] = val;
    return val;
  }
  function del(target2, key) {
    if (Array.isArray(target2)) {
      target2.splice(key, 1);
      return;
    }
    delete target2[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data2 = JSON.parse(raw);
        Object.assign(currentSettings, data2);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target2) {
      this.target = target2;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target2 = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target2.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target2.__VUE_DEVTOOLS_PLUGINS__ = target2.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
    * pinia v2.0.26
    * (c) 2022 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "\u{1F34D} " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia2.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      pinia2.state.value = JSON.parse(await navigator.clipboard.readText());
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia2) {
    try {
      saveAs(new Blob([JSON.stringify(pinia2.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia2) {
    try {
      const open2 = await getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      pinia2.state.value = JSON.parse(text);
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "\u{1F34D} Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data2, event) => {
        data2.keys.push(event.key);
        data2.operations.push(event.type);
        data2.oldValue[event.key] = event.oldValue;
        data2.newValue[event.key] = event.newValue;
        return data2;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const getStoreType = (id) => "\u{1F34D} " + id;
  function registerPiniaDevtools(app, pinia2) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia \u{1F34D}",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia \u{1F34D}`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia \u{1F34D}",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia2);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia2);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: "Reset the state (option store only)",
            action: (nodeId) => {
              const store = pinia2._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (!store._isOptionsAPI) {
                toastMessage(`Cannot reset "${nodeId}" store because it's a setup store.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : Object.keys(store.$state).reduce((state, key) => {
                state[key] = store.$state[key];
                return state;
              }, {})
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia2];
          stores = stores.concat(Array.from(pinia2._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("\u{1F34D}")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia2._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia \u{1F34D}",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "\u{1F6EB} " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "\u{1F6EC} " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "\u{1F4A5} " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: {
            store: formatDisplay(store.$id),
            ...formatEventData(events)
          },
          groupId: activeAction
        };
        activeAction = void 0;
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "\u2935\uFE0F";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "\u{1F9E9}";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "\u{1F525} " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store \u{1F5D1}`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed \u{1F195}`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        });
        return actions[actionName].apply(trackedStore, arguments);
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    if (options.state) {
      store._isOptionsAPI = true;
    }
    if (typeof options.state === "function") {
      patchActionForGrouping(
        store,
        Object.keys(options.actions)
      );
      const originalHotUpdate = store._hotUpdate;
      vue.toRaw(store)._hotUpdate = function(newStore) {
        originalHotUpdate.apply(this, arguments);
        patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions));
      };
    }
    addStoreToDevtools(
      app,
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = vue.markRaw({
      install(app) {
        setActivePinia(pinia2);
        {
          pinia2._a = app;
          app.provide(piniaSymbol, pinia2);
          app.config.globalProperties.$pinia = pinia2;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia2);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia2.use(devtoolsPlugin);
    }
    return pinia2;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  function mergeReactiveObjects(target2, patchToApply) {
    if (target2 instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target2.set(key, value));
    }
    if (target2 instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target2.add, target2);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target2[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target2.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target2[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target2[key] = subPatch;
      }
    }
    return target2;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? vue.toRefs(vue.ref(state ? state() : {}).value) : vue.toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[\u{1F34D}]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    store.$reset = function $reset() {
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    };
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia2._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("\u{1F34D} debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = vue.markRaw([]);
    let actionSubscriptions = vue.markRaw([]);
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = () => {
      throw new Error(`\u{1F34D}: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    };
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia2,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(
      assign(
        {
          _hmrPayload,
          _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        },
        partialStore
      )
    );
    pinia2._s.set($id, store);
    const setupStore = pinia2._e.run(() => {
      scope = vue.effectScope();
      return scope.run(() => setup());
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? options.getters[key] : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia2.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia2.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? vue.computed(() => {
            setActivePinia(pinia2);
            return getter.call(store, store);
          }) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, {
          value: store[p],
          ...nonEnumerable
        });
      });
    }
    pinia2._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[\u{1F34D}]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia2, hot) {
      const currentInstance = vue.getCurrentInstance();
      pinia2 = pinia2 || currentInstance && vue.inject(piniaSymbol);
      if (pinia2)
        setActivePinia(pinia2);
      if (!activePinia) {
        throw new Error(`[\u{1F34D}]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
      }
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
        {
          useStore._pinia = pinia2;
        }
      }
      const store = pinia2._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia2, true) : createOptionsStore(hotId, assign({}, options), pinia2, true);
        hot._hotUpdate(newStore);
        delete pinia2.state.value[hotId];
        pinia2._s.delete(hotId);
      }
      if (IS_CLIENT && currentInstance && currentInstance.proxy && !hot) {
        const vm = currentInstance.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function mapState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = function() {
        return useStore(this.$pinia)[key];
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = function() {
        const store = useStore(this.$pinia);
        const storeKey = keysOrMapper[key];
        return typeof storeKey === "function" ? storeKey.call(this, store) : store[storeKey];
      };
      return reduced;
    }, {});
  }
  function mapWritableState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[key];
        },
        set(value) {
          return useStore(this.$pinia)[key] = value;
        }
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[keysOrMapper[key]];
        },
        set(value) {
          return useStore(this.$pinia)[keysOrMapper[key]] = value;
        }
      };
      return reduced;
    }, {});
  }
  const useDeviceStore = defineStore("device", () => {
    function setDeivce(env) {
      device.value = env;
    }
    const device = vue.ref("");
    const statusBarHeight = vue.ref(0);
    const fixedTop = vue.computed(() => statusBarHeight.value * 2);
    return {
      setDeivce,
      device,
      statusBarHeight,
      fixedTop
    };
  });
  const _export_sfc = (sfc, props) => {
    const target2 = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target2[key] = val;
    }
    return target2;
  };
  const _sfc_main$w = {
    name: "yx-common-wrapper",
    props: {
      bg: {
        type: String,
        default: "common"
      }
    },
    mounted() {
    },
    data() {
      return {};
    },
    methods: {},
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"]),
      bgColor() {
        switch (this.bg) {
          case "common":
            return "bg-common";
          case "white":
            return "bg-white";
          default:
            formatAppLog("log", "at components/yx-common-wrapper.vue:37", "\u6CA1\u6709\u5339\u914D\u5230\u6837\u5F0F");
            break;
        }
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["bg-common fill-screen font-sm position-fixed overflow-hidden", $options.bgColor]),
      style: vue.normalizeStyle(`top:${_ctx.fixedTop}rpx;`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 6);
  }
  const YxCommonWrapper = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-common-wrapper.vue"]]);
  const _sfc_main$v = {
    name: "yx-popup",
    emits: ["hide", "action"],
    props: {
      popItem: {
        Object,
        default: [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u8BBE\u4E3A\u7F6E\u9876",
            event: "setTop"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u5220\u9664\u8BE5\u804A\u5929",
            event: "delChat"
          }
        ]
      },
      popPosittion: {
        type: Object,
        default: {
          x: 350,
          y: 30
        }
      },
      isDark: {
        type: Boolean,
        default: false
      },
      show: [Boolean],
      isBottom: {
        type: Boolean,
        default: false
      },
      isChat: {
        type: Boolean,
        default: false
      },
      isCustom: {
        type: Boolean,
        default: false
      },
      popHeight: {
        type: Number
      },
      popupContentOfUtilInBottom: [Array],
      utilArr: [Array],
      emoArr: [Array],
      bottomMode: [String],
      bottomClickTransition: [Boolean],
      isCoverTop: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    methods: {
      handleReactive(item) {
        formatAppLog("log", "at components/yx-popup.vue:106", "\u6307\u4EE4\u5373\u5C06\u4FEE\u6539\u66F4\u6539", item);
        this.$emit("action", item.event);
        this.$emit("hide");
      },
      hide() {
        formatAppLog("log", "at components/yx-popup.vue:112", "\u6211\u6765\u5B8C\u6210\u9690\u85CF");
        this.$emit("hide");
      }
    },
    computed: {
      position() {
        if (this.isBottom) {
          return `left:${this.popPosittion.x}rpx;bottom:${this.popPosittion.y}rpx`;
        }
        if (this.isChat) {
          this.popPosittion.x *= 2;
          this.popPosittion.y *= 2;
        }
        return `left:${this.popPosittion.x}rpx;top:${this.popPosittion.y}rpx`;
      },
      styleCustom() {
        let res = "";
        if (this.isBottom) {
          res += this.isBottom ? " fixed-bottom  bg-gray " : " border ";
        } else {
          res += this.isDark ? " bg-dark text-white " : "bg-white text-dark ";
        }
        return res;
      },
      maskClass() {
        let res = "";
        if (this.isCoverTop) {
          res += "zTop";
        }
        if (this.isCustom) {
          res += "bg-dark lucency-5";
        }
        formatAppLog("log", "at components/yx-popup.vue:154", "@pop", res);
        return res;
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: vue.normalizeClass([$options.styleCustom, "zTop border-dark p-2 flex t position-fixed rounded font-md"]),
        style: vue.normalizeStyle($props.show ? `display:block;${$options.position}` : `display:none;${$options.position};`)
      }, [
        vue.createCommentVNode(" \u666E\u901A\u529F\u80FD\u63D0\u793A\u6846 "),
        $props.isChat ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.popItem, (item, i2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              onClick: ($event) => $options.handleReactive(item),
              class: "flex-1",
              key: item.id,
              style: vue.normalizeStyle(i2 !== $props.popItem.length - 1 && item.content ? "margin-bottom:30rpx" : "")
            }, [
              item.icon ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: vue.normalizeClass(["iconfont font-md p-1", item.icon])
              }, null, 2)) : vue.createCommentVNode("v-if", true),
              item.content ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 1,
                class: "font-md"
              }, vue.toDisplayString(item.content), 1)) : vue.createCommentVNode("v-if", true)
            ], 12, ["onClick"]);
          }), 128))
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" \u5E95\u90E8\u529F\u80FD\u6846 "),
        $props.isBottom ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "transition-ease-fast",
          style: vue.normalizeStyle(`height:${$props.popHeight}rpx;width:100%;`)
        }, [
          vue.renderSlot(_ctx.$slots, "util"),
          vue.renderSlot(_ctx.$slots, "emo")
        ], 4)) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", null, [
          vue.renderSlot(_ctx.$slots, "custom")
        ])
      ], 6),
      vue.createCommentVNode(" \u70B9\u51FB\u53D6\u6D88 "),
      vue.createElementVNode("view", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.hide && $options.hide(...args)),
        style: vue.normalizeStyle([$props.show ? "display:block" : "display:none", { "left": "0", "top": "0" }]),
        class: vue.normalizeClass([$options.maskClass, "fill-screen position-absolute"]),
        id: "mask"
      }, null, 6)
    ], 64);
  }
  const YxPopup = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-popup.vue"]]);
  const _sfc_main$u = {
    name: "yx-tool-bar",
    emits: ["clickNav"],
    props: {
      title: [String],
      isSelf: {
        type: Boolean,
        default: false
      }
    },
    components: { YxPopup },
    mounted() {
      if (!this.isSelf) {
        this.initPopup();
        formatAppLog("log", "at components/yx-tool-bar.vue:36", "\u521D\u59CB\u5316");
      }
      formatAppLog("log", "at components/yx-tool-bar.vue:38", "@tool", this);
    },
    data() {
      return {
        popShow: false,
        popPosition: {},
        popData: []
      };
    },
    methods: {
      initPopup() {
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        device.screenHeight;
        this.popPosition = { x: maxX - 170, y: 100 };
        this.popIsDark = true;
        this.popShow = false;
        this.popData = [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u53D1\u8D77\u7FA4\u804A"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u6DFB\u52A0\u670B\u53CB"
          },
          {
            id: 3,
            icon: "icon-saoyisao",
            content: "\u626B\u4E00\u626B"
          },
          {
            id: 4,
            icon: "icon-shoufukuan1",
            content: "\u6536\u4ED8\u6B3E"
          },
          {
            id: 5,
            icon: "icon-help",
            content: "\u5E2E\u52A9\u4E0E\u53CD\u9988"
          }
        ];
      },
      showPopup() {
        this.popShow = true;
      },
      handleClick() {
        formatAppLog("log", "at components/yx-tool-bar.vue:89", "@clickcc", this);
        if (this.isSelf) {
          this.$emit("clickNav");
        } else {
          this.showPopup();
        }
      }
    },
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(' <view class="fixed-top flex justify-between p-2 align-center pr-4 " :style="`top:${fixedTop}rpx`" style="background-color: #efefeb;"> '),
      vue.createElementVNode("view", {
        class: "fixed-top flex justify-between p-2 align-center pr-4",
        style: vue.normalizeStyle([`top:${_ctx.fixedTop}rpx`, { "background-color": "#efefeb" }])
      }, [
        vue.createElementVNode("view", { class: "font-lg" }, vue.toDisplayString($props.title), 1),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", { class: "iconfont icon-search font-lg pr-5 font-lg" }),
          vue.createElementVNode("text", {
            class: "iconfont icon-add font-lg",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
          })
        ])
      ], 4),
      vue.createCommentVNode(' <view style="margin-top: 100rpx;"></view> '),
      !$props.isSelf ? (vue.openBlock(), vue.createBlock(_component_yx_popup, {
        key: 0,
        popItem: $data.popData,
        popPosittion: $data.popPosition,
        show: $data.popShow,
        isDark: true,
        isChat: true,
        isCoverTop: true,
        onHide: _cache[1] || (_cache[1] = ($event) => $data.popShow = false)
      }, null, 8, ["popItem", "popPosittion", "show"])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u5360\u4F4D\u5899 "),
      vue.createCommentVNode(' <view style="margin-top: 100rpx;"> </view> ')
    ], 64);
  }
  const YxToolBar = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-tool-bar.vue"]]);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var dayjs_min = { exports: {} };
  (function(module, exports) {
    !function(t, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i2 = "second", s = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i3 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i3, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i3 = e2.clone().add(r2, f), s2 = n2 - i3 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
        return +(-(r2 + (n2 - i3) / (s2 ? i3 - u2 : u2 - i3)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i2, ms: r, Q: h }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = function(t2) {
        return t2 instanceof _;
      }, S = function t2(e2, n2, r2) {
        var i3;
        if (!e2)
          return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i3 = s2), n2 && (D[s2] = n2, i3 = s2);
          var u2 = e2.split("-");
          if (!i3 && u2.length > 1)
            return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i3 = a2;
        }
        return !r2 && i3 && (g = i3), i3 || !r2 && g;
      }, w = function(t2, e2) {
        if (p(t2))
          return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, O = v;
      O.l = S, O.i = p, O.w = function(t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = S(t2.locale, null, true), this.parse(t2);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2)
              return new Date(NaN);
            if (O.u(e2))
              return new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i3 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i3, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i3, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = w(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return w(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < w(t2);
        }, m2.$g = function(t2, e2, n2) {
          return O.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t2), l2 = function(t3, e3) {
            var i3 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i3 : i3.endOf(a);
          }, $2 = function(t3, e3) {
            return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (h2) {
            case c:
              return r2 ? l2(1, 0) : l2(31, 11);
            case f:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i2:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = O.p(t2), h2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s] = h2 + "Minutes", n2[i2] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === f || o2 === c) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[O.p(t2)]();
        }, m2.add = function(r2, h2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = O.p(h2), y2 = function(t2) {
            var e2 = w(l2);
            return O.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === f)
            return this.set(f, this.$M + r2);
          if ($2 === c)
            return this.set(c, this.$y + r2);
          if ($2 === a)
            return y2(1);
          if ($2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i2] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i3 = O.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, f2 = n2.months, h2 = function(t3, n3, i4, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i4[n3].slice(0, s3);
          }, c2 = function(t3) {
            return O.s(s2 % 12 || 12, t3, "0");
          }, d2 = n2.meridiem || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, $2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(n2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(n2.weekdaysMin, this.$W, o2, 2), ddd: h2(n2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: O.s(s2, 2, "0"), h: c2(1), hh: c2(2), a: d2(s2, u2, true), A: d2(s2, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: i3 };
          return r2.replace(y, function(t3, e3) {
            return e3 || $2[t3] || i3.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, v2 = this - M3, g2 = O.m(this, M3);
          return g2 = ($2 = {}, $2[c] = g2 / 12, $2[f] = g2, $2[h] = g2 / 3, $2[o] = (v2 - m3) / 6048e5, $2[a] = (v2 - m3) / 864e5, $2[u] = v2 / n, $2[s] = v2 / e, $2[i2] = v2 / t, $2)[y2] || v2, l2 ? g2 : O.a(g2);
        }, m2.daysInMonth = function() {
          return this.endOf(f).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = S(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), T = _.prototype;
      return w.prototype = T, [["$ms", r], ["$s", i2], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t2) {
        T[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), w.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, w), t2.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
        return w(1e3 * t2);
      }, w.en = D[g], w.Ls = D, w.p = {}, w;
    });
  })(dayjs_min);
  const dayjs = dayjs_min.exports;
  const _sfc_main$t = {
    name: "yx-badge",
    props: {
      messageCount: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {};
    },
    computed: {
      count() {
        return this.messageCount > 99 ? `99+` : this.messageCount;
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      id: "badge",
      class: "rounded-circle bg-danger font-sm p-1 position-absolute"
    }, vue.toDisplayString($options.count), 1);
  }
  const YxBadge = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-ab87c323"], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-badge.vue"]]);
  const _sfc_main$s = {
    name: "chat-item",
    components: { YxBadge },
    props: {
      user: [Object]
    },
    data() {
      return {};
    },
    methods: {
      handleClick(e) {
      }
    },
    computed: {
      time() {
        return dayjs(this.user.message_time).format("HH:mm");
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_badge = vue.resolveComponent("yx-badge");
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between p-2",
      "hover-class": "bg-common",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
    }, [
      vue.createElementVNode("image", {
        class: "rounded size-1 pr-2",
        src: $props.user.image_src,
        mode: "aspectFill"
      }, null, 8, ["src"]),
      vue.createVNode(_component_yx_badge, {
        messageCount: $props.user.message_count
      }, null, 8, ["messageCount"]),
      vue.createElementVNode("view", {
        id: "user-content",
        class: "flex flex-1 flex-column justify-between"
      }, [
        vue.createElementVNode("view", {
          id: "user-name",
          class: "text-ellipsis text-primary"
        }, vue.toDisplayString($props.user.user_name), 1),
        vue.createElementVNode("view", {
          id: "content ",
          class: "text-ellipsis font-sm text-common mb-1"
        }, vue.toDisplayString($props.user.user_message), 1)
      ]),
      vue.createElementVNode("view", {
        id: "message-time",
        class: "font-sm text-common"
      }, vue.toDisplayString($options.time), 1)
    ]);
  }
  const chatItem = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__file", "D:/aLearning/project/uniapp-chat-project/components/chat-item.vue"]]);
  const userList = [
    {
      id: 1,
      image_src: "/static/logo.png",
      messagge_count: 7,
      user_name: "\u65E0\u5948",
      user_message: "\u4F60\u4ECA\u5929\u5403\u7684\u662F\u4EC0\u4E48",
      message_time: Date.now() - 2e5,
      is_top: false
    },
    {
      id: 2,
      image_src: "/static/logo1.png",
      messagge_count: 3,
      user_name: "\u6B66\u57CE",
      user_message: "\u57CE\u5899\u539A\u5B9E",
      message_time: Date.now() - 12e4,
      is_top: false
    },
    {
      id: 3,
      image_src: "/static/images/extends/voice.png",
      messagge_count: 1,
      user_name: "\u4E4C\u67653333332222222111133",
      user_message: "\u4E4C\u62C9",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 4,
      image_src: "/static/images/extends/star.png",
      messagge_count: 0,
      user_name: "\u8389\u5A1C",
      user_message: "\u6211\u6765\u8FA3",
      message_time: Date.now() - 34e4,
      is_top: false
    },
    {
      id: 5,
      image_src: "/static/images/extends/man.png",
      messagge_count: 1,
      user_name: "\u963F\u82B3",
      user_message: "\u4F60\u597D\uFF0C\u6211\u54E6\u662F\u963F\u82B3",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 6,
      image_src: "/static/images/extends/location.png",
      messagge_count: 0,
      user_name: "\u73CD\u59AE\u7279",
      user_message: "\u8D77\u98DE",
      message_time: Date.now() - 34e4,
      is_top: false
    },
    {
      id: 7,
      image_src: "/static/images/extends/hongbao.png",
      messagge_count: 1,
      user_name: "\u874E\u5B50\u83B1\u83B1",
      user_message: "\u6211\u4F1A\u53D8\u8EAB",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 8,
      image_src: "/static/images/extends/camera.png",
      messagge_count: 0,
      user_name: "\u708E\u9F99\u94E0\u7532",
      user_message: "\u708E\u9F99\u4E4B\u529B",
      message_time: Date.now() - 34e4,
      is_top: false
    }
  ];
  const _sfc_main$r = {
    name: "yx-flexible-wrapperer",
    emits: ["scroll"],
    props: {
      bottom: {
        type: String,
        default: "12vh"
      },
      height: {
        type: String,
        default: "100vh"
      },
      scrollIntoView: {
        type: String
      },
      scrollTop: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        havingContentScrolling: true,
        reachBorder: true,
        scrollDirection: "top",
        movingPosition: {},
        movingDistance: 0,
        isReachingBorder: false,
        contentLack: true,
        contentLackToTop: false
      };
    },
    methods: {
      scrolling(e) {
        if (!this.havingContentScrolling)
          return;
        this.contentLack = false;
        this.reachBorder = false;
        this.isReachingBorder = false;
        this.scrollDirection = "";
        this.$emit("scroll");
      },
      scrollToTop(e) {
        formatAppLog("log", "at components/yx-flexible-wrapperer.vue:91", "\u6EDA\u52A8\u5230\u9876\u90E8", e);
        this.reachBorder = true;
        this.scrollDirection = e.detail.direction;
        this.havingContentScrolling = false;
      },
      scrollToBottom(e) {
        formatAppLog("log", "at components/yx-flexible-wrapperer.vue:97", "\u6EDA\u52A8\u5230\u5E95\u90E8", e);
        this.reachBorder = true;
        this.scrollDirection = e.detail.direction;
        this.havingContentScrolling = false;
      },
      handleTouchStart(e) {
        if (this.reachBorder) {
          let x = e.changedTouches[0].clientX;
          let y = e.changedTouches[0].clientY;
          this.movingPosition = { x, y };
          formatAppLog("log", "at components/yx-flexible-wrapperer.vue:109", "\u5F00\u59CB\u89E6\u6478", e);
        }
      },
      handleTouchMove(e) {
        if (this.reachBorder) {
          e.changedTouches[0].clientX;
          let y = e.changedTouches[0].clientY;
          let distance;
          if (this.contentLack) {
            distance = this.movingPosition.y - y;
            this.contentLackToTop = distance > 0;
            this.movingDistance = distance;
            this.isReachingBorder = true;
          } else if (this.scrollDirection === "top") {
            distance = this.movingPosition.y - y;
            if (distance < 0) {
              this.movingDistance = distance;
              this.isReachingBorder = true;
            } else {
              this.havingContentScrolling = true;
              this.reachBorder = false;
              this.isReachingBorder = false;
            }
          } else if (this.scrollDirection === "bottom") {
            distance = this.movingPosition.y - y;
            if (distance > 0) {
              this.movingDistance = distance;
              formatAppLog("log", "at components/yx-flexible-wrapperer.vue:144", this.movingDistance);
              this.isReachingBorder = true;
            } else {
              this.havingContentScrolling = true;
              this.reachBorder = false;
              this.isReachingBorder = false;
            }
          }
        }
      },
      handleTouchEnd(e) {
        if (this.reachBorder) {
          formatAppLog("log", "at components/yx-flexible-wrapperer.vue:158", "\u7ED3\u675F\u79FB\u52A8", e);
          this.havingContentScrolling = true;
          this.reachBorder = true;
          this.isReachingBorder = false;
          this.movingDistance = 0;
        }
      }
    },
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"]),
      contentShowBorder() {
        if (this.scrollDirection === "bottom" || this.contentLackToTop) {
          return `top:${this.fixedTop + 100 - this.movingDistance}rpx;bottom:${this.bottom};height:${this.height}`;
        } else if (this.scrollDirection === "top") {
          return `top:${this.fixedTop + 100 + Math.abs(this.movingDistance)}rpx;bottom:${this.bottom};height:${this.height}`;
        }
        return `top:${this.fixedTop + 100}rpx;bottom:${this.bottom};height:${this.height}`;
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(" \u589E\u52A0\u72B6\u6001\u680F\u906E\u6321\u5C42\uFF0C\u9632\u6B62\u5143\u7D20\u66B4\u9732 "),
      vue.createElementVNode("view", {
        class: "zTop bg-common position-fixed",
        style: vue.normalizeStyle(`height:${_ctx.fixedTop}rpx;top:0;width:100%`)
      }, null, 4),
      vue.createCommentVNode(' <view class="fill-screen overflow-hidden "> '),
      vue.createCommentVNode(" scroll-top \u7528\u4E8E\u521D\u59CB\u5316\u52A0\u8F7D\u4E00\u6B21\u6EDA\u52A8 "),
      vue.createElementVNode("scroll-view", {
        onScrolltoupper: _cache[3] || (_cache[3] = (...args) => $options.scrollToTop && $options.scrollToTop(...args)),
        onScroll: _cache[4] || (_cache[4] = (...args) => $options.scrolling && $options.scrolling(...args)),
        onScrolltolower: _cache[5] || (_cache[5] = (...args) => $options.scrollToBottom && $options.scrollToBottom(...args)),
        "scroll-y": "true",
        "scroll-top": $props.scrollTop,
        "scrollinto-view": $props.scrollIntoView,
        class: "position-fixed font-md",
        style: vue.normalizeStyle($options.contentShowBorder)
      }, [
        vue.createCommentVNode(" \u5185\u5BB9\u533A\u57DF "),
        vue.createCommentVNode(" \u9876\u90E8\u5360\u4F4D "),
        vue.createCommentVNode(' <view  class="bg-transparent"  :style="topBox"></view> '),
        vue.createCommentVNode(" \uFF01\uFF01\u6EDA\u52A8\u5230\u9876\u90E8\u548C\u5E95\u90E8\u4E8B\u4EF6\u53EA\u6709\u5728\u80FD\u5B8C\u6210\u6EDA\u52A8\u65F6\u624D\u80FD\u591F\u89E6\u53D1\uFF0C\u8FBE\u5230\u6EDA\u52A8\u6761\u4EF6 "),
        vue.createCommentVNode(" \u5F53\u89E6\u5E95\u6216\u89E6\u9876\u65F6\u6309\u56FA\u5B9A\u5B9A\u4F4D\u8FDB\u884C\u663E\u793A "),
        vue.createCommentVNode(' <view class="position-fixed" > '),
        vue.createCommentVNode(" \u6ED1\u52A8\u7B56\u75651 \u7ED9\u4E00\u4E2Aposition:fixed\u8FDB\u884C\u6ED1\u52A8\u5931\u8D25 \u4E0A\u6ED1\u52A8\u751F\u6548\uFF0C\u4E0B\u6ED1\u52A8\u56E0\u4E3A\u5176\u9ED8\u8BA4\u884C\u4E3A\u6BCF\u6B21\u90FD\u4F1A\u56DE\u5230\u9876\u90E8\u5931\u8D25 ;; bug\u4EE5\u89E3\u51B3\uFF0C\u901A\u8FC7\u6539\u53D8scroll-view\u5185\u5BB9\u8FDB\u884C\u5904\u7406\u5373\u53EF "),
        vue.createCommentVNode(" \u6ED1\u52A8\u7B56\u75652 \u7ED9\u4E00\u4E2Aposition:absolute\u8FDB\u884C\u6ED1\u52A8 "),
        vue.createCommentVNode(" \u6ED1\u52A8\u7B56\u75653 \u7ED9\u4E00\u4E2A\u4E0A\u4E0B\u5360\u4F4D\u6846(\u900F\u660E)\uFF0C\u5176\u9AD8\u5EA6\u4E3A0\uFF0C\u5B9E\u9645\u9AD8\u5EA6\u901A\u8FC7\u6ED1\u52A8\u7684\u8DDD\u79BB\u786E\u5B9A \uFF0C\u4E0B\u62C9\u5B58\u5728bug\uFF0C\u56E0\u4E3A\u53EA\u6709\u6ED1\u52A8\u65F6\u5185\u5BB9\u624D\u80FD\u88AB\u5C55\u793A(\u4E0A\u62C9\u4E4B\u6240\u4EE5\u4E3Abug\u56E0\u4E3A\u9996\u5143\u7D20\u5728\u5176\u524D\uFF0C\u4E0D\u9700\u8981\u6ED1\u52A8\u5373\u53EF\u52A0\u8F7D)\u3002\u4F7F\u7528\u5B9A\u4F4D\u89E3\u51B3\uFF1F"),
        vue.createCommentVNode(" \u53EF\u5B8C\u6210\u5E95\u90E8\u6EDA\u52A8\uFF0C\u5F53\u89E6\u6478\u4E8B\u4EF6\u6DFB\u52A0\u5230scroll-view\u4E0A\u65F6\u65E0\u6CD5\u5B8C\u6210\u5E95\u90E8\u6EDA\u52A8 "),
        vue.createCommentVNode(" \u7B56\u7565\u4E00 "),
        vue.createCommentVNode(' <view :style="requireScroll"   @touchstart="handleTouchStart"   @touchend="handleTouchEnd" @touchmove="handleTouchMove" style="height: 100vh;"> '),
        vue.createCommentVNode(" \u7B56\u7565\u4E8C "),
        vue.createCommentVNode(' <view  style="height:90%"  @touchstart="handleTouchStart"   @touchend="handleTouchEnd" @touchmove="handleTouchMove" > '),
        vue.createElementVNode("view", {
          style: { "height": "100vh" },
          onTouchstart: _cache[0] || (_cache[0] = (...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
          onTouchend: _cache[1] || (_cache[1] = (...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
          onTouchmove: _cache[2] || (_cache[2] = (...args) => $options.handleTouchMove && $options.handleTouchMove(...args))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 32),
        vue.createCommentVNode(" \u5E95\u90E8\u5360\u4F4D "),
        vue.createCommentVNode(' <view  class="bg-transparent" :style="bottomBox"></view> ')
      ], 44, ["scroll-top", "scrollinto-view"]),
      vue.createCommentVNode(" </view> ")
    ], 64);
  }
  const YxFlexibleWrapper = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-flexible-wrapperer.vue"]]);
  const _sfc_main$q = {
    components: {
      YxToolBar,
      chatItem,
      YxPopup,
      YxCommonWrapper,
      YxFlexibleWrapper
    },
    mounted() {
      this.userTopList = this.userList.filter((user) => user.is_top);
    },
    data() {
      return {
        curUser: {},
        userList,
        userTopList: [],
        popData: [],
        popPosition: {},
        popShow: false,
        popIsDark: false,
        touchPosition: {},
        touchStartTime: 0
      };
    },
    methods: {
      scrollBottom(e) {
        formatAppLog("log", "at pages/tabbar/chat/chat.vue:73", "\u6EDA\u52A8\u5230\u5E95\u90E8\u4E86", e);
      },
      goChat(user) {
        uni.navigateTo({
          url: `/pages/chat-detail/chat-detail?id=${user.id}&name=${user.user_name}`
        });
      },
      handleTouch(user, e) {
        this.touchStartTime = e.timeStamp;
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        this.touchPosition = { x, y };
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        const maxY = device.screenHeight;
        x = x + 130 > maxX ? maxX - 130 : x;
        y = y + 100 > maxY ? maxY - 100 : y;
        y = y - 60 < 0 ? 60 : y;
        this.popPosition = { x, y };
      },
      handleLeave(user, e) {
        const endTime = e.timeStamp;
        let y = e.changedTouches[0].clientY;
        if (endTime - this.touchStartTime > 400 && Math.abs(this.touchPosition.y - y) < 100) {
          this.popShow = true;
          this.popIsDark = false;
          this.curUser = user;
          this.popData = [
            {
              id: 1,
              icon: "",
              content: user.is_top ? "\u53D6\u6D88\u7F6E\u9876" : "\u8BBE\u4E3A\u7F6E\u9876",
              event: user.is_top ? "undoTop" : "setTop"
            },
            {
              id: 2,
              icon: "",
              content: "\u5220\u9664\u8BE5\u804A\u5929",
              event: "delChat"
            }
          ];
        }
      },
      handlePopHide() {
        this.popShow = false;
      },
      popAction(event) {
        switch (event) {
          case "delChat":
            this.userList = this.userList.filter((user) => user.id != this.curUser.id);
            this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
            return;
          case "undoTop":
            this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
            this.userList.forEach((user) => {
              if (user.id === this.curUser.id) {
                user.is_top = false;
              }
            });
            return;
          case "setTop":
            this.curUser.is_top = true;
            this.userTopList.unshift({ ...this.curUser });
            this.userList.forEach((user) => {
              if (user.id === this.curUser.id)
                user.is_top = true;
            });
            return;
          default:
            formatAppLog("log", "at pages/tabbar/chat/chat.vue:155", "\u9519\u8BEF\u5F97\u4E8B\u4EF6\u8C03\u7528");
        }
      },
      clickNav() {
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        device.screenHeight;
        this.popPosition = { x: maxX - 180, y: 100 };
        this.popIsDark = true;
        this.popShow = true;
        formatAppLog("log", "at pages/tabbar/chat/chat.vue:166", "@clickNav");
        this.popData = [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u53D1\u8D77\u7FA4\u804A"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u6DFB\u52A0\u670B\u53CB"
          },
          {
            id: 3,
            icon: "icon-saoyisao",
            content: "\u626B\u4E00\u626B"
          },
          {
            id: 4,
            icon: "icon-shoufukuan1",
            content: "\u6536\u4ED8\u6B3E"
          },
          {
            id: 5,
            icon: "icon-help",
            content: "\u5E2E\u52A9\u4E0E\u53CD\u9988"
          }
        ];
      }
    },
    computed: {
      userCount() {
        return this.userList.length;
      },
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_chat_item = vue.resolveComponent("chat-item");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, { bg: "white" }, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_tool_bar, {
          onClickNav: $options.clickNav,
          title: `\u5FAE\u4FE1(${$options.userCount})`,
          isSelf: ""
        }, null, 8, ["onClickNav", "title"]),
        vue.createCommentVNode(' <yx-tool-bar  :title="`\u5FAE\u4FE1(${userCount})`"></yx-tool-bar> '),
        vue.createCommentVNode(" \u7F6E\u9876\u804A\u5929 "),
        vue.createCommentVNode(' <scroll-view @scrolltolower="scrollBottom" scroll-y="true" class="position-fixed font-md"  :style="`top:${fixedTop+100}rpx;bottom:100rpx`"> '),
        vue.createVNode(_component_yx_flexible_wrapper, null, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userTopList, (user) => {
              return vue.openBlock(), vue.createBlock(_component_chat_item, {
                key: user.id,
                user,
                onClick: ($event) => $options.goChat(user),
                onTouchstart: (e) => $options.handleTouch(user, e),
                onTouchend: (e) => $options.handleLeave(user, e),
                class: "bg-common",
                "hover-class": "bg-dark"
              }, null, 8, ["user", "onClick", "onTouchstart", "onTouchend"]);
            }), 128)),
            vue.createCommentVNode(" \u5E38\u89C4\u804A\u5929 "),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userList, (user) => {
              return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                key: user.id
              }, [
                !user.is_top ? (vue.openBlock(), vue.createBlock(_component_chat_item, {
                  key: 0,
                  user,
                  onClick: ($event) => $options.goChat(user),
                  onTouchstart: (e) => $options.handleTouch(user, e),
                  onTouchend: (e) => $options.handleLeave(user, e)
                }, null, 8, ["user", "onClick", "onTouchstart", "onTouchend"])) : vue.createCommentVNode("v-if", true)
              ], 64);
            }), 128))
          ]),
          _: 1
        }),
        vue.createCommentVNode(" </scroll-view> "),
        vue.createVNode(_component_yx_popup, {
          show: $data.popShow,
          popPosittion: $data.popPosition,
          isDark: $data.popIsDark,
          isChat: true,
          popItem: $data.popData,
          onAction: $options.popAction,
          onHide: $options.handlePopHide
        }, null, 8, ["show", "popPosittion", "isDark", "popItem", "onAction", "onHide"])
      ]),
      _: 1
    });
  }
  const PagesTabbarChatChat = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/chat/chat.vue"]]);
  const _sfc_main$p = {
    name: "yx-list",
    props: {
      item: {
        type: Object,
        default: {
          title: "\u5C55\u793A",
          img: "/static/contact/1.pngg"
        }
      },
      title: [String],
      img: [String],
      icon: [String],
      isCell: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between align-center pl-2 border-bottom font-md",
      style: { "height": "100rpx" }
    }, [
      vue.createElementVNode("view", null, [
        vue.renderSlot(_ctx.$slots, "prefix")
      ]),
      $props.icon ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        class: vue.normalizeClass(`iconfont font-md ${$props.icon}`)
      }, null, 2)) : vue.createCommentVNode("v-if", true),
      $props.img ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "rounded overflow-hidden",
        style: { "width": "75rpx", "height": "75rpx" }
      }, [
        vue.createElementVNode("image", {
          src: $props.img,
          style: { "width": "100%", "height": "100%" },
          mode: "aspectFill"
        }, null, 8, ["src"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "flex-1 ml-2" }, vue.toDisplayString($props.title), 1),
      vue.createElementVNode("view", { style: { "font-weight": "300" } }, [
        vue.renderSlot(_ctx.$slots, "suffix")
      ]),
      $props.isCell ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "iconfont icon-right mr-2"
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const YxList = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-list.vue"]]);
  const _sfc_main$o = {
    name: "yx-divider",
    data() {
      return {};
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { style: { "height": "30rpx", "width": "100%", "background-color": "#f1eced" } });
  }
  const YxDivider = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-divider.vue"]]);
  const _sfc_main$n = {
    components: { YxList, YxDivider, YxCommonWrapper, YxFlexibleWrapper, YxToolBar },
    data() {
      return {
        data: [
          [
            {
              id: 0,
              title: "\u670B\u53CB\u5708",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true,
              event: "circle"
            },
            {
              id: 12,
              title: "\u5C0F\u7A0B\u5E8F",
              icon: "icon-xiaochengxu",
              isCell: true
            }
          ],
          [
            {
              id: 1,
              title: "\u626B\u4E00\u626B",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true,
              suffix: {
                content: "\u5185\u5BB9"
              }
            }
          ],
          [
            {
              id: 2,
              title: "\u6E38\u620F",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 3,
              title: "\u8D2D\u7269",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 4,
              title: "\u770B\u4E00\u770B",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ]
        ]
      };
    },
    methods: {
      handleEvent(data2) {
        switch (data2.event) {
          case "circle":
            this.routerGo("/pages/tabbar/find/FriendCIrcle/FriendCIrcle");
            break;
          default:
            formatAppLog("log", "at pages/tabbar/find/find.vue:90", "\u6CA1\u6709\u6B64\u4E8B\u4EF6");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_divider = vue.resolveComponent("yx-divider");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, null, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_tool_bar, { title: "" }),
        vue.createVNode(_component_yx_flexible_wrapper, null, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.data, (group, i2) => {
              return vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: i2 }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(group, (d) => {
                  return vue.openBlock(), vue.createBlock(_component_yx_list, {
                    onClick: ($event) => $options.handleEvent(d),
                    style: { "background-color": "white" },
                    key: d.id,
                    "hover-class": "main-bg-hover-color",
                    title: d.title,
                    isCell: d.isCell,
                    icon: d.icon
                  }, {
                    suffix: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(d.suffix && d.suffix.content), 1)
                    ]),
                    _: 2
                  }, 1032, ["onClick", "title", "isCell", "icon"]);
                }), 128)),
                vue.createVNode(_component_yx_divider)
              ], 64);
            }), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    });
  }
  const PagesTabbarFindFind = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/find/find.vue"]]);
  const _sfc_main$m = {
    name: "yx-card",
    props: {
      img: [String],
      title: [String],
      desc: [String],
      isCover: {
        type: [Boolean],
        default: true
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between p-3",
      "hover-class": $props.isCover ? "bg-common" : ""
    }, [
      vue.createElementVNode("image", {
        class: "rounded size-1",
        src: $props.img,
        mode: "aspectFill"
      }, null, 8, ["src"]),
      vue.createElementVNode("view", { class: "flex flex-1 ml-2 flex-column justify-between" }, [
        vue.createElementVNode("view", { class: "text-ellipsis font-md text-dark text-primary" }, vue.toDisplayString($props.title), 1),
        vue.createElementVNode("view", { class: "text-ellipsis font-sm text-common mb-1" }, [
          vue.createTextVNode(vue.toDisplayString($props.desc) + " ", 1),
          vue.renderSlot(_ctx.$slots, "desc")
        ])
      ]),
      vue.createElementVNode("view", { class: "font-sm text-common" }, [
        vue.renderSlot(_ctx.$slots, "right")
      ])
    ], 8, ["hover-class"]);
  }
  const YxCard = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-card.vue"]]);
  const _sfc_main$l = {
    components: { YxCard, YxDivider, YxList, YxCommonWrapper, YxFlexibleWrapper, YxToolBar },
    data() {
      return {
        data: [
          [
            {
              id: 2,
              title: "\u652F\u4ED8",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 0,
              title: "\u6536\u85CF",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            },
            {
              id: 12,
              title: "\u76F8\u518C",
              icon: "icon-xiaochengxu",
              isCell: true
            },
            {
              id: 1,
              title: "\u8868\u60C5",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true,
              suffix: {
                content: "\u5185\u5BB9"
              }
            }
          ],
          [
            {
              id: 2,
              title: "\u8BBE\u7F6E",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ]
        ]
      };
    },
    methods: {
      toUserInfo() {
        uni.navigateTo({
          url: "/pages/tabbar/user/UserInfo/UserInfo"
        });
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_yx_card = vue.resolveComponent("yx-card");
    const _component_yx_divider = vue.resolveComponent("yx-divider");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, null, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_tool_bar, { title: "" }),
        vue.createVNode(_component_yx_flexible_wrapper, null, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", {
              class: "position-relative",
              style: { "width": "100%", "height": "150rpx", "background-color": "white" }
            }, [
              vue.createElementVNode("text", {
                class: "iconfont icon-help position-absolute",
                style: { "right": "20rpx", "top": "30rpx" }
              })
            ]),
            vue.createVNode(_component_yx_card, {
              img: "/static/logo.png",
              class: "bg-white",
              title: "\u695A\u4E91",
              desc: "\u6D4B\u8BD5\u6570\u636E",
              onClick: $options.toUserInfo
            }, {
              right: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "mt-3" }, [
                  vue.createElementVNode("text", { class: "iconfont icon-saoyisao font-lg" }),
                  vue.createElementVNode("text", { class: "iconfont icon-right font-lg" })
                ])
              ]),
              _: 1
            }, 8, ["onClick"]),
            vue.createVNode(_component_yx_divider),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.data, (group, i2) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i2,
                class: "bg-white"
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(group, (d) => {
                  return vue.openBlock(), vue.createBlock(_component_yx_list, {
                    key: d.id,
                    "hover-class": "bg-common",
                    title: d.title,
                    isCell: d.isCell,
                    icon: d.icon
                  }, {
                    suffix: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(d.suffix && d.suffix.content), 1)
                    ]),
                    _: 2
                  }, 1032, ["title", "isCell", "icon"]);
                }), 128)),
                vue.createVNode(_component_yx_divider)
              ]);
            }), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    });
  }
  const PagesTabbarUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/user/user.vue"]]);
  let groups = [];
  for (let i2 = "A".charCodeAt(0); i2 <= "Z".charCodeAt(0); i2++) {
    if (Math.floor(Math.random() * 3) === 0)
      continue;
    let group = {
      group: String.fromCharCode(i2),
      userList: []
    };
    for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
      let user = {
        id: Math.random() * 1e4,
        img: "/static/images/mail/friend.png",
        title: String.fromCharCode(i2) + (j + 1)
      };
      group.userList.push(user);
    }
    groups.push(group);
  }
  formatAppLog("log", "at static/testData/friendList.js:26", "@group", groups);
  const _sfc_main$k = {
    components: { YxToolBar, YxList, YxFlexibleWrapper },
    mounted() {
      formatAppLog("log", "at pages/tabbar/friend/friend.vue:33", "@rrrr", groups);
      this.friendList = groups;
      for (var i2 = 65; i2 <= 90; i2++) {
        this.friendPrefixPosition.push(String.fromCharCode(i2));
      }
      this.friendPrefixPosition.push("#");
    },
    data() {
      return {
        base_com: [
          {
            id: 1,
            img: "/static/images/mail/group.png",
            title: "\u7FA4\u804A"
          },
          {
            id: 2,
            img: "/static/images/mail/tag.png",
            title: "\u6807\u7B7E"
          },
          {
            id: 3,
            img: "/static/images/mail/friend.png",
            title: "\u65B0\u589E\u670B\u53CB"
          }
        ],
        friendList: [],
        friendPrefixPosition: [],
        sliderTarget: ""
      };
    },
    methods: {
      startSlide(target2) {
        formatAppLog("log", "at pages/tabbar/friend/friend.vue:70", "\u70B9\u51FB\u5F97\u4E3A", target2);
        formatAppLog("log", "at pages/tabbar/friend/friend.vue:71", this.friendList.find((obj) => obj.group == target2));
        if (this.friendList.find((obj) => obj.group == target2)) {
          this.sliderTarget = target2;
        } else {
          this.slsiderTarget = "";
        }
      },
      toast() {
        formatAppLog("log", "at pages/tabbar/friend/friend.vue:79", "click");
      }
    },
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_yx_tool_bar, { title: "\u901A\u8BAF\u5F55" }),
      vue.createCommentVNode(" \u65E0\u6CD5\u5305\u88C5\u4E3A\u6ED1\u52A8\u5757\uFF0C\u5BFC\u822A\u4F1A\u4E22\u5931 "),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "true",
        class: "position-fixed font-sm",
        style: vue.normalizeStyle(`top:${_ctx.fixedTop + 100}rpx;height:88vh`),
        "scroll-into-view": `hash-abc-1-${$data.sliderTarget}`
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.base_com, (item) => {
          return vue.openBlock(), vue.createBlock(_component_yx_list, {
            key: item.id,
            onClick: $options.toast,
            img: item.img,
            title: item.title
          }, null, 8, ["onClick", "img", "title"]);
        }), 128)),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.friendList, (friends, i2) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "font-md",
            key: i2
          }, [
            vue.createElementVNode("view", {
              class: "bg-common pl-2",
              style: { "width": "100vw" },
              id: `hash-abc-1-${friends.group}`
            }, vue.toDisplayString(friends.group), 9, ["id"]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(friends.userList, (data2) => {
              return vue.openBlock(), vue.createBlock(_component_yx_list, {
                img: data2.img,
                title: data2.title,
                key: data2.id
              }, null, 8, ["img", "title"]);
            }), 128))
          ]);
        }), 128))
      ], 12, ["scroll-into-view"]),
      vue.createElementVNode("view", {
        class: "flex flex-column position-fixed text-center font-sm text-dark",
        style: { "right": "10rpx", "top": "200rpx" }
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.friendPrefixPosition, (prefix) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            onClick: ($event) => $options.startSlide(prefix),
            key: prefix
          }, vue.toDisplayString(prefix), 9, ["onClick"]);
        }), 128))
      ])
    ]);
  }
  const PagesTabbarFriendFriend = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/friend/friend.vue"]]);
  const _sfc_main$j = {
    name: "yx-nav-bar",
    props: {
      title: {
        type: String
      },
      existMore: {
        type: Boolean,
        default: true
      },
      requireOccupy: {
        type: Boolean,
        default: true
      },
      isOpacity: {
        type: Boolean,
        default: false
      },
      routerPath: {
        type: String
      },
      isChat: {
        type: Boolean,
        default: false
      },
      titleCenter: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    methods: {
      back() {
        if (!this.isChat) {
          uni.navigateBack();
        } else {
          uni.switchTab({
            url: "/pages/tabbar/chat/chat"
          });
        }
      },
      navPush() {
        formatAppLog("log", "at components/yx-nav-bar.vue:65", "\u53BB\u5F80", this.routerPath);
        uni.navigateTo({
          url: this.routerPath
        });
      }
    },
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["flex justify-between align-center p-2 fixed-top", $props.isOpacity ? "bg-transparent" : "bg-white"]),
        style: vue.normalizeStyle(`top:${_ctx.fixedTop}rpx`)
      }, [
        vue.createCommentVNode(` <view class="flex justify-between align-center p-2  position-fixed" :class="isOpacity ? 'bg-transparent':'bg-white'" > `),
        vue.createElementVNode("view", {
          id: "back-sign",
          class: "icon-left iconfont mr-2",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.back && $options.back(...args))
        }),
        vue.createElementVNode("view", {
          id: "user-view",
          class: vue.normalizeClass(["flex-1", $props.titleCenter ? "text-center" : ""])
        }, vue.toDisplayString($props.title), 3),
        $props.existMore ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          id: "more-detail",
          class: "icon-ellipsis iconfont",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.navPush && $options.navPush(...args))
        })) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { id: "end-detail" }, [
          vue.renderSlot(_ctx.$slots, "suffix")
        ])
      ], 6),
      vue.createCommentVNode(" \u906E\u6321\u586B\u5145 "),
      $props.requireOccupy ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        style: { "padding-top": "90rpx" }
      })) : vue.createCommentVNode("v-if", true)
    ], 64);
  }
  const YxNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-nav-bar.vue"]]);
  const _sfc_main$i = {
    name: "yx-chat-item-content",
    inject: ["validPreviewOfImage", "touchMessageOfChat", "touchLeaveMessageOfChat"],
    props: {
      chatMessage: [Object]
    },
    mounted() {
    },
    data() {
      return {
        audioManager: plus.audio.createPlayer({}),
        playAudio: false,
        videoImage: ""
      };
    },
    methods: {
      videoFirstLoad(width, height, during) {
        formatAppLog("log", "at components/chat/yx-chat-item-content.vue:54", width, height, during);
      },
      handleAudio() {
        if (this.chatMessage.type !== "audio")
          return;
        this.audioManager.addEventListener("play", () => {
          this.audioManager.seekTo(0);
          this.playAudio = true;
        });
        this.audioManager.addEventListener("stop", () => {
          this.playAudio = false;
        });
        this.audioManager.addEventListener("ended", () => {
          this.playAudio = false;
        });
        this.audioManager.addEventListener("pause", () => {
          this.playAudio = false;
        });
        this.audioManager.setStyles({ src: this.chatMessage.data });
        this.audioManager.play();
      }
    },
    computed: {
      recordWidth() {
        let time = this.chatMessage.record_time;
        if (time) {
          if (time <= 6) {
            return 130;
          }
          let resWidth = 130;
          time -= 6;
          while (time > 0) {
            resWidth += 30;
            time -= 6;
          }
          return resWidth;
        }
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      onClick: _cache[2] || (_cache[2] = (...args) => $options.handleAudio && $options.handleAudio(...args)),
      onTouchstart: _cache[3] || (_cache[3] = (e) => $options.touchMessageOfChat($props.chatMessage, e)),
      onTouchend: _cache[4] || (_cache[4] = (e) => $options.touchLeaveMessageOfChat($props.chatMessage, e)),
      class: "font-md overflow-hidden"
    }, [
      $props.chatMessage.type === "text" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "text-overflow-line p-1"
      }, [
        vue.createElementVNode("view", {
          innerHTML: $props.chatMessage.data
        }, null, 8, ["innerHTML"]),
        vue.createCommentVNode(" {{}} ")
      ])) : vue.createCommentVNode("v-if", true),
      $props.chatMessage.type === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
        key: 1,
        onClick: _cache[0] || (_cache[0] = ($event) => $options.validPreviewOfImage($props.chatMessage.data)),
        mode: "scaleToFill",
        src: $props.chatMessage.data,
        style: { "height": "250rpx", "width": "200rpx" }
      }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
      $props.chatMessage.type === "audio" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "p-1",
        style: vue.normalizeStyle([{ "min-width": "130rpx", "max-width": "440rpx" }, `width:${$options.recordWidth}rpx`])
      }, [
        vue.createCommentVNode(" \u5224\u65AD\u662F\u54EA\u4E00\u65B9\u7684\u4FE1\u606F\uFF0C\u4FBF\u4E8E\u5728\u6B63\u786E\u7684\u4F4D\u7F6E\u4E0A\u663E\u793A "),
        vue.createCommentVNode(" \u6211\u65B9\u5F55\u97F3\u6D88\u606F "),
        $props.chatMessage.user_id == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "flex justify-end"
        }, [
          vue.createTextVNode(vue.toDisplayString($props.chatMessage.record_time) + '" ', 1),
          $data.playAudio ? (vue.openBlock(), vue.createElementBlock("image", {
            key: 0,
            src: "/static/audio/play.gif",
            class: "play-icon"
          })) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "iconfont icon-wifi rotate-right-90 ml-2"
          }))
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" \u5BF9\u65B9\u5F55\u97F3\u6D88\u606F "),
        $props.chatMessage.user_id != 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "flex justify-start"
        }, [
          $data.playAudio ? (vue.openBlock(), vue.createElementBlock("image", {
            key: 0,
            class: "play-icon",
            src: "/static/audio/play.gif"
          })) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "iconfont icon-wifi rotate-left-90 mr-2"
          })),
          vue.createTextVNode(" " + vue.toDisplayString($props.chatMessage.record_time) + '" ', 1)
        ])) : vue.createCommentVNode("v-if", true)
      ], 4)) : vue.createCommentVNode("v-if", true),
      $props.chatMessage.type === "video" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "overflow-hidden"
      }, [
        vue.createElementVNode("video", {
          src: $props.chatMessage.data,
          style: { "width": "300rpx", "height": "400rpx" },
          "play-btn-position": "center",
          onLoadedmetadata: _cache[1] || (_cache[1] = (...args) => $options.videoFirstLoad && $options.videoFirstLoad(...args))
        }, null, 40, ["src"]),
        vue.createCommentVNode(' <image :src="videoImage"></image> ')
      ])) : vue.createCommentVNode("v-if", true)
    ], 32);
  }
  const YxChatItemContent = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-24a89cde"], ["__file", "D:/aLearning/project/uniapp-chat-project/components/chat/yx-chat-item-content.vue"]]);
  const _sfc_main$h = {
    name: "yx-chat-item-detail",
    components: {
      YxChatItemContent
    },
    props: {
      chatMessage: {
        type: Object,
        default: {
          user_id: 0,
          type: "image",
          message_time: Date.now() - 1e4,
          data: "/static/images/bg.jpg",
          user_image: "/static/logo.png",
          showTime: true
        }
      }
    },
    mounted() {
    },
    data() {
      return {};
    },
    methods: {
      toUserMessagePage() {
        uni.navigateTo({
          url: `/pages/UserInfo/UserInfo`
        });
      }
    },
    computed: {
      time() {
        return dayjs(this.chatMessage.message_time).format("YYYY\u5E74MM\u6708DD\u65E5 HH:mm");
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_chat_item_content = vue.resolveComponent("yx-chat-item-content");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.chatMessage.showTime && !$props.chatMessage.isDel ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        class: "ele-center mb-2 font-sm text-common"
      }, [
        vue.createCommentVNode(" 2022\u5E7412\u670813\u65E5 13:21 "),
        vue.createTextVNode(" " + vue.toDisplayString($options.time), 1)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u6211\u65B9\u4FE1\u606F "),
      $props.chatMessage.user_id == 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "flex justify-end p-2 position-relative"
      }, [
        vue.createCommentVNode(" \u4E09\u89D2 "),
        vue.createElementVNode("view", {
          id: "me-triangle",
          class: "position-absolute left-triangle",
          style: { "top": "40rpx", "right": "81rpx", "border-left-color": "#08c060" }
        }),
        vue.createElementVNode("view", {
          class: "mr-2 font-small main-bg-color p-1 rounded",
          style: { "line-height": "38rpx", "min-height": "40rpx", "max-width": "500rpx" }
        }, [
          vue.createVNode(_component_yx_chat_item_content, { chatMessage: $props.chatMessage }, null, 8, ["chatMessage"])
        ]),
        vue.createElementVNode("image", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.toUserMessagePage && $options.toUserMessagePage(...args)),
          src: $props.chatMessage.user_image,
          mode: "scaleToFill",
          style: { "width": "60rpx", "height": "60rpx" }
        }, null, 8, ["src"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u5BF9\u65B9\u4FE1\u606F "),
      $props.chatMessage.user_id != 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "flex justify-start p-2 position-relative"
      }, [
        vue.createCommentVNode(" \u4E09\u89D2 "),
        vue.createElementVNode("view", {
          id: "other-triangle",
          class: "position-absolute right-triangle",
          style: { "top": "40rpx", "left": "81rpx", "border-right-color": "white" }
        }),
        vue.createElementVNode("image", {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.toUserMessagePage && $options.toUserMessagePage(...args)),
          src: $props.chatMessage.user_image,
          mode: "scaleToFill",
          style: { "width": "60rpx", "height": "60rpx" }
        }, null, 8, ["src"]),
        vue.createElementVNode("view", {
          class: "ml-2 font-small bg-white p-1 rounded",
          style: { "line-height": "38rpx", "min-height": "40rpx", "max-width": "500rpx" }
        }, [
          vue.createVNode(_component_yx_chat_item_content, { chatMessage: $props.chatMessage }, null, 8, ["chatMessage"])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u4FE1\u606F\u88AB\u64A4\u56DE "),
      $props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "flex justify-center align-center text-common font-sm m-2"
      }, " \u8BE5\u6D88\u606F\u5DF2\u64A4\u56DE ")) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u6D88\u606F\u5185\u5BB9\u7C7B\u578B(\u6587\u672C\uFF0C\u8BED\u97F3\uFF0C\u56FE\u7247\uFF0C\u89C6\u9891) ")
    ]);
  }
  const YxChatItemDetail = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "D:/aLearning/project/uniapp-chat-project/components/chat/yx-chat-item-detail.vue"]]);
  var isIos;
  isIos = plus.os.name == "iOS";
  function gotoAppPermissionSetting() {
    if (isIos) {
      var UIApplication = plus.ios.import("UIApplication");
      var application2 = UIApplication.sharedApplication();
      var NSURL2 = plus.ios.import("NSURL");
      var setting2 = NSURL2.URLWithString("app-settings:");
      application2.openURL(setting2);
      plus.ios.deleteObject(setting2);
      plus.ios.deleteObject(NSURL2);
      plus.ios.deleteObject(application2);
    } else {
      var Intent = plus.android.importClass("android.content.Intent");
      var Settings = plus.android.importClass("android.provider.Settings");
      var Uri = plus.android.importClass("android.net.Uri");
      var mainActivity = plus.android.runtimeMainActivity();
      var intent = new Intent();
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
      intent.setData(uri);
      mainActivity.startActivity(intent);
    }
  }
  const _sfc_main$g = {
    name: "yx-chat-detail-input",
    emits: ["syn", "addMessage", "activeUtil", "hide"],
    props: {},
    mounted() {
      this.getInputHeight();
      this.autoFocus = true;
    },
    data() {
      return {
        chatInputHeight: 0,
        curLine: 1,
        inputContent: "",
        inputContentCache: "",
        textareaParams: {
          minHeight: 40,
          maxHeight: 150
        },
        keyboardHeight: 0,
        activeKeyboardHeight: 549,
        originVal: 105,
        stepVal: 55,
        inputChangeHeight: 0,
        isText: false,
        isOpenSwipeUtil: false,
        isOpenEmo: false,
        isFocus: false,
        inputMode: "keyboard",
        getFocusOnKeyboard: false,
        recordManager: plus.audio.getRecorder(),
        touchPosition: {},
        isRecording: false,
        isUndoRecording: false,
        isValidRecord: true,
        isClickUtil: false,
        recordingTime: 0,
        havingRecordAuth: false,
        audioPath: "",
        audioManager: plus.audio.createPlayer({})
      };
    },
    methods: {
      requestPermission() {
        let vm = this;
        let platform = plus.os.name;
        if (platform === "Android") {
          formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:127", "\u8BF7\u6C42\u6743\u9650");
          plus.android.requestPermissions(["android.permission.RECORD_AUDIO"], function(e) {
            formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:131", "\u6743\u9650\u5BF9\u8C61", e);
            if (e.deniedAlways.length > 0 || e.deniedPresent.length > 0) {
              uni.showModal({
                title: "\u5173\u4E8E\u5F55\u97F3\u6743\u9650",
                content: "\u5F55\u97F3\u6743\u9650\u83B7\u53D6\u5931\u8D25\uFF0C\u5982\u679C\u60A8\u4E0D\u5BF9\u6B64\u8F6F\u4EF6\u5F00\u542F\u6B64\u6743\u9650\u5C06\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\u5F55\u97F3\u529F\u80FD",
                confirmText: "\u53BB\u6388\u6743",
                cancelText: "\u62D2\u7EDD",
                success(e2) {
                  if (e2.confirm) {
                    formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:141", "\u540C\u610F\u5F00\u542F\u6743\u9650\uFF0C\u5373\u5C06\u8DF3\u8F6C");
                    gotoAppPermissionSetting();
                    this.havingRecordAuth = true;
                  } else if (e2.cancel) {
                    formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:145", "\u4E0D\u540C\u610F\u5F00\u542F\u6743\u9650");
                  }
                },
                fail() {
                }
              });
            }
            if (e.granted.length > 0) {
              this.havingRecordAuth = true;
            }
          }, function(e) {
            uni.showToast({
              title: "\u8BF7\u6C42\u5F55\u97F3\u6743\u9650\u5931\u8D25\uFF0C\u8BF7\u5230\u8BBE\u7F6E\u6743\u9650\u91CC\u627E\u5230\u5E94\u7528\u624B\u52A8\u5F00\u542F\u6743\u9650\uFF0C\u5426\u5219\u5C06\u4E0D\u80FD\u4F7F\u7528\u6B64\u529F\u80FD\u3002",
              icon: "error"
            });
          });
        } else if (platform === "iOS") {
          vm.recorderPlus.record({}, function() {
          }, function(e) {
            if (e.code === 2) {
              uni.showModal({
                title: "\u5173\u4E8E\u5F55\u97F3\u6743\u9650",
                content: "\u5F55\u97F3\u6743\u9650\u83B7\u53D6\u5931\u8D25\uFF0C\u5982\u679C\u60A8\u4E0D\u5BF9\u6B64\u8F6F\u4EF6\u5F00\u542F\u6B64\u6743\u9650\u5C06\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\u5F55\u97F3\u529F\u80FD",
                confirmText: "\u53BB\u6388\u6743",
                cancelText: "\u62D2\u7EDD",
                success(e2) {
                  if (e2.confirm) {
                    formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:172", "\u540C\u610F\u5F00\u542F\u6743\u9650\uFF0C\u5373\u5C06\u8DF3\u8F6C");
                    gotoAppPermissionSetting();
                    this.havingRecordAuth = true;
                  } else if (e2.cancel) {
                    formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:176", "\u4E0D\u540C\u610F\u5F00\u542F\u6743\u9650");
                  }
                },
                fail() {
                }
              });
            }
            formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:186", JSON.stringify(e));
          });
          vm.recorderPlus.stop();
        } else {
          this.startRecord();
        }
      },
      getRecordAuth() {
        let permission = plus.navigator.checkPermission("RECORD");
        formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:196", "\u5F53\u524D\u7684\u6743\u9650\u4E3A", permission);
        formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:197", permission);
        switch (permission) {
          case "authorized":
          case "unknown":
            this.havingRecordAuth = true;
            break;
          case "denied":
          case "undetermined":
            this.requestPermission();
            break;
          default:
            formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:211", "\u8BBE\u5907\u4E0D\u652F\u6301\u5F55\u97F3");
            break;
        }
      },
      startRecord(e) {
        this.getRecordAuth();
        if (!this.havingRecordAuth) {
          return;
        }
        const recordObj = {
          filename: "_doc/audio/",
          format: "mp3"
        };
        const self2 = this;
        this.recordManager.record(recordObj, (e2) => {
          self2.audioPath = e2;
          self2.audioManager.setStyles({ src: e2 });
          setTimeout(() => {
            if (self2.isValidRecord) {
              const audio_time = Math.ceil(self2.audioManager.getDuration());
              self2.$emit("addMessage", self2.audioPath, "audio", audio_time);
            }
            self2.isValidRecord = true;
          }, 60);
        }, (err) => {
          formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:250", "\u5F55\u97F3\u9519\u8BEF", err);
        });
        this.touchPosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        this.isRecording = true;
        this.recordingTime = e.timeStamp;
      },
      moveRecord(e) {
        if (!this.havingRecordAuth) {
          return;
        }
        const y = e.touches[0].clientY;
        this.isUndoRecording = Math.abs(this.touchPosition.y - y) >= 60;
      },
      endRecord(e) {
        if (!this.havingRecordAuth) {
          return;
        }
        const y = e.changedTouches[0].clientY;
        const endTime = e.timeStamp;
        const limitTime = 1e3;
        if (Math.abs(this.touchPosition.y - y) >= 60 || endTime - this.recordingTime < limitTime) {
          this.isValidRecord = false;
          if (Math.abs(this.touchPosition.y - y) >= 60) {
            uni.showToast({
              title: "\u53D6\u6D88\u5F55\u97F3\u6210\u529F",
              duration: 500,
              icon: "none"
            });
          }
          if (endTime - this.recordingTime < limitTime) {
            uni.showToast({
              title: "\u8BED\u97F3\u65F6\u95F4\u592A\u77ED\uFF0C\u53D6\u6D88\u5F55\u97F3",
              duration: 500,
              icon: "none"
            });
          }
        }
        this.recordManager.stop();
        this.isRecording = false;
        this.recordingTime = 0;
        this.isUndoRecording = false;
      },
      toggleMode() {
        if (this.inputMode === "keyboard") {
          this.inputContent = "";
          this.handleFocus();
          this.getInputHeight("audio");
          this.inputMode = "audio";
          this.getFocusOnKeyboard = false;
        } else {
          this.inputMode = "keyboard";
          this.getFocusOnKeyboard = true;
        }
      },
      getInputHeight(event = "keyboard") {
        switch (event) {
          case "keyboard":
            if (this.curLine == 1) {
              this.chatInputHeight = this.originVal;
            } else {
              this.chatInputHeight = this.increamentVal + this.originVal;
            }
            if (this.keyboardHeight > 0) {
              this.chatInputHeight += this.keyboardHeight + 90;
            }
            break;
          case "util":
            this.chatInputHeight = this.activeKeyboardHeight + this.originVal + this.stepVal;
            break;
          case "audio":
            this.chatInputHeight = this.originVal;
            break;
          default:
            formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:352", "\u9519\u8BEF\u7684\u4E8B\u4EF6");
            break;
        }
        this.$emit("syn");
      },
      activeUtilSwiper() {
        this.isOpenSwipeUtil = true;
        this.inputMode = "keyboard";
        this.isClickUtil = true;
        this.$emit("activeUtil", "utils");
        this.getInputHeight("util");
      },
      activeEmot() {
        this.isOpenEmo = true;
        this.inputMode = "keyboard";
        this.isClickUtil = true;
        this.$emit("activeUtil", "emo");
        this.getInputHeight("util");
      },
      textareaLineChangeHandle(e) {
        if (this.isClickUtil)
          return;
        this.curLine = e.detail.lineCount;
        this.inputChangeHeight = e.detail.height;
        this.getInputHeight();
      },
      handleFocus() {
        this.isOpenEmo = false;
        this.isOpenSwipeUtil = false;
        this.$emit("hide");
      },
      textareaInputChange(e) {
      },
      sendMessage() {
        if (!this.inputContent)
          return;
        this.$emit("addMessage", this.inputContent, "text");
        this.inputContent = "";
      },
      keyboardHeightChangeHandle(e) {
        const height = e.detail.height;
        if (!this.keyboardHeight && height) {
          this.keyboardHeight = height + 200;
        }
        const isPullState = height > 0;
        if (isPullState) {
          this.isFocus = true;
          this.chatInputHeight += this.keyboardHeight;
        } else {
          this.chatInputHeight -= this.keyboardHeight;
          this.keyboardHeight = 0;
          this.isFocus = false;
          this.isOpenEmo = false;
          this.isOpenSwipeUtil = false;
          this.$emit("hide");
        }
        this.getInputHeight();
      }
    },
    watch: {
      inputContent: {
        handler() {
          this.isText = this.inputContent.length > 0;
          if (this.isText) {
            this.isClickUtil = false;
          } else {
            this.curLine = 1;
          }
        }
      }
    },
    computed: {
      minHeight() {
        return this.textareaParams.minHeight;
      },
      maxHeight() {
        return this.textareaParams.maxHeight;
      },
      inputHeight() {
        return this.isFocus || this.isOpenEmo || this.isOpenSwipeUtil ? this.activeKeyboardHeight + 50 : 0;
      },
      increamentVal() {
        let res = this.inputChangeHeight > this.maxHeight - this.stepVal ? this.maxHeight - this.minHeight : this.inputChangeHeight - this.minHeight + this.stepVal;
        return res;
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: "fixed-bottom transition-ease-fast-plus bg-white-four-deep flex justify-between align-center p-1",
        style: vue.normalizeStyle(`min-height:60rpx;bottom:${$options.inputHeight}rpx`),
        ref: "inputRef",
        id: "chat-input"
      }, [
        vue.createElementVNode("view", {
          id: "record-sign",
          class: vue.normalizeClass(["icon-keyboard iconfont mr-1 font-lg", $data.inputMode !== "keyboard" ? "icon-record" : "icon-keyboard"]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleMode && $options.toggleMode(...args))
        }, null, 2),
        vue.createElementVNode("view", {
          id: "input",
          class: "flex-1 p-1"
        }, [
          $data.inputMode == "keyboard" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("textarea", {
            key: 0,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.inputContent = $event),
            focus: $data.getFocusOnKeyboard,
            "auto-height": "",
            class: "flex-1 bg-white-one-deep p-1 rounded",
            onLinechange: _cache[2] || (_cache[2] = (...args) => $options.textareaLineChangeHandle && $options.textareaLineChangeHandle(...args)),
            onFocus: _cache[3] || (_cache[3] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
            onInput: _cache[4] || (_cache[4] = (...args) => $options.textareaInputChange && $options.textareaInputChange(...args)),
            onKeyboardheightchange: _cache[5] || (_cache[5] = (...args) => $options.keyboardHeightChangeHandle && $options.keyboardHeightChangeHandle(...args)),
            style: vue.normalizeStyle(`min-height: ${$options.minHeight}rpx;max-height:${$options.maxHeight}rpx;width: 95%;overflow:auto`),
            maxlength: -1,
            "placeholder-style": "color:#F76260",
            "adjust-position": false
          }, null, 44, ["focus"])), [
            [vue.vModelText, $data.inputContent]
          ]) : vue.createCommentVNode("v-if", true),
          $data.inputMode == "audio" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: vue.normalizeClass(["grid grid-center-by-el font-md p-1 mr-1 rounded", $data.isRecording ? "bg-white-three-deep" : "bg-white "]),
            onTouchstart: _cache[6] || (_cache[6] = (...args) => $options.startRecord && $options.startRecord(...args)),
            onTouchmove: _cache[7] || (_cache[7] = (...args) => $options.moveRecord && $options.moveRecord(...args)),
            onTouchend: _cache[8] || (_cache[8] = (...args) => $options.endRecord && $options.endRecord(...args))
          }, "\u6309\u4F4F \u8BF4\u8BDD", 34)) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          id: "more-operate",
          class: "mr-2"
        }, [
          vue.createElementVNode("text", {
            class: "iconfont icon-smile font-lg mr-1 vertical-middle",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.activeEmot && $options.activeEmot(...args))
          }),
          !$data.isText ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "iconfont icon-add font-lg p-1 vertical-middle",
            onClick: _cache[10] || (_cache[10] = (...args) => $options.activeUtilSwiper && $options.activeUtilSwiper(...args))
          })) : vue.createCommentVNode("v-if", true),
          $data.isText ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "iconfont font-sm main-bg-color p-1 text-white",
            onClick: _cache[11] || (_cache[11] = (...args) => $options.sendMessage && $options.sendMessage(...args))
          }, "\u53D1\u9001")) : vue.createCommentVNode("v-if", true)
        ])
      ], 4),
      vue.createCommentVNode(" \u5F00\u542F\u5F55\u97F3\u65F6\u7684\u906E\u7F69\u5C42 "),
      vue.createCommentVNode(" grid grid-center-by-grid-and-ele "),
      $data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        id: "record-mask",
        class: "grid grid-center-by-grid-and-ele lucency-5 bg-gray-shallow fill-screen"
      }, [
        vue.createElementVNode("view", {
          class: "rounded p-2 zTop bg-white-five-deep grid grid-center-by-el",
          style: { "opacity": "1", "width": "340rpx", "height": "300rpx" }
        }, [
          vue.createElementVNode("image", {
            style: { "width": "150rpx", "height": "260rpx" },
            src: $data.isUndoRecording ? `/static/audio/recording.gif` : `/static/audio/play.gif`,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", null, vue.toDisplayString($data.isUndoRecording ? `\u677E\u5F00\u53D6\u6D88\u5F55\u97F3` : `\u5F55\u97F3\u4E2D`), 1)
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ], 64);
  }
  const YxChatDetailInput = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "D:/aLearning/project/uniapp-chat-project/components/chat/yx-chat-detail-input.vue"]]);
  const chatMesssage = [
    {
      id: "a1",
      user_id: 0,
      type: "text",
      message_time: Date.now() - 1e6,
      isUndone: false,
      isDel: false,
      data: `33
				3
				3`,
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a1",
      user_id: 0,
      type: "image",
      message_time: Date.now() - 1e6,
      isUndone: false,
      isDel: false,
      data: "/static/images/bg.jpg",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a2",
      user_id: 1,
      type: "image",
      message_time: Date.now() - 1e4,
      isUndone: false,
      isDel: false,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a3",
      user_id: 1,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now() - 1e4,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a4",
      user_id: 1,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now() - 1e4,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a6",
      user_id: 0,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now(),
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a8",
      user_id: 0,
      type: "audio",
      isUndone: false,
      isDel: false,
      message_time: Date.now(),
      data: "/static/images/nothing/no_pay.png",
      record_time: "5",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a9",
      user_id: 1,
      type: "audio",
      isUndone: false,
      isDel: false,
      message_time: Date.now(),
      data: "/static/images/nothing/no_pay.png",
      record_time: "14",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a10",
      user_id: 1,
      type: "audio",
      isUndone: false,
      isDel: false,
      message_time: Date.now(),
      data: "/static/images/nothing/no_pay.png",
      record_time: "39",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a11",
      user_id: 1,
      type: "audio",
      isUndone: false,
      isDel: false,
      message_time: Date.now(),
      data: "/static/images/nothing/no_pay.png",
      record_time: "59",
      user_image: "/static/logo.png",
      showTime: true
    }
  ];
  const chatUtils = [
    [
      {
        id: "001",
        text: "\u76F8\u518C",
        img_src: "/static/images/extends/pic.png",
        event: "upload"
      },
      {
        id: "002",
        text: "\u62CD\u6444",
        img_src: "/static/images/extends/camera.png",
        event: "camera"
      },
      {
        id: "003",
        text: "\u8BED\u97F3\u901A\u8BDD",
        img_src: "/static/images/extends/phone.png"
      },
      {
        id: "004",
        text: "\u4F4D\u7F6E",
        img_src: "/static/images/extends/location.png"
      },
      {
        id: "005",
        text: "\u8BED\u97F3\u8F93\u5165",
        img_src: "/static/images/extends/voice.png"
      },
      {
        id: "006",
        text: "\u6536\u85CF",
        img_src: "/static/images/extends/star.png"
      },
      {
        id: "007",
        text: "\u7EA2\u5305",
        img_src: "/static/images/extends/hongbao.png"
      },
      {
        id: "008",
        text: "\u540D\u7247",
        img_src: "/static/images/extends/man.png"
      }
    ],
    [
      {
        id: "009",
        text: "\u56FE\u7247",
        img_src: "/static/images/extends/pic.png"
      }
    ]
  ];
  const data = [];
  const nMax = 19;
  for (var i = 0; i <= nMax; i++) {
    const obj = {
      id: `00${i}`,
      text: `\u8868\u60C5${i}`,
      img_src: `/static/images/emoticon/5497/${i}.gif`
    };
    data.push(obj);
  }
  const _sfc_main$f = {
    components: {
      YxNavBar,
      YxChatItemDetail,
      YxChatDetailInput,
      YxPopup,
      YxCommonWrapper
    },
    provide() {
      return {
        touchMessageOfChat: this.handleTouch,
        touchLeaveMessageOfChat: this.handleLeave,
        validPreviewOfImage: this.previewImage
      };
    },
    onLoad(query) {
      this.name = query.name;
    },
    mounted() {
      this.scrollBottom();
    },
    data() {
      return {
        name: "",
        isCompleteConvert: false,
        scrollHeight: 1,
        scrollViewHeight: 0,
        userMessage: chatMesssage,
        curUserMessage: {},
        popData: [],
        popPosition: {},
        popIsDark: false,
        popShow: false,
        touchTarget: "",
        touchStartTime: 0,
        isBottom: false,
        isChat: false,
        popupHeight: 0,
        bottomMode: "",
        utilArr: chatUtils,
        emoArr: data,
        bottomClickTransition: false,
        popupBottomData: chatUtils
      };
    },
    methods: {
      previewImage(path) {
        uni.previewImage({
          current: path,
          indicator: "number",
          urls: this.imageArr,
          longPressActions: {
            itemList: ["\u53D1\u9001\u7ED9\u670B\u53CB", "\u4FDD\u5B58\u56FE\u7247", "\u6536\u85CF"],
            success: function(data2) {
              formatAppLog("log", "at pages/chat-detail/chat-detail.vue:150", "\u6267\u884C\u957F\u6309\u64CD\u4F5C", data2);
              formatAppLog("log", "at pages/chat-detail/chat-detail.vue:151", "\u9009\u4E2D\u4E86\u7B2C" + (data2.tapIndex + 1) + "\u4E2A\u6309\u94AE,\u7B2C" + (data2.index + 1) + "\u5F20\u56FE\u7247");
            },
            fail: function(err) {
              formatAppLog("log", "at pages/chat-detail/chat-detail.vue:154", err.errMsg);
            }
          }
        });
      },
      utilEventHandle(event) {
        const self2 = this;
        switch (event) {
          case "upload":
            plus.gallery.pick(({ files }) => {
              files.forEach((path) => {
                const imageType = ["BMP", "DIB", "PCP", "DIF", "WMF", "GIF", "JPG", "TIF", "EPS", "PSD", "CDR", "IFF", "TGA", "PCD", "MPT", "PNG"];
                const videoType = ["AVI", "mov", "rmvb", "rm", "FLV", "mp4", "3GP"];
                const sep = path.lastIndexOf(".") + 1;
                const fileSuffix = path.substring(sep, path.length);
                if (imageType.map((m) => m.toLowerCase()).includes(fileSuffix) || imageType.map((m) => m.toUpperCase()).includes(fileSuffix)) {
                  self2.addMessage(path, "image");
                }
                if (videoType.map((m) => m.toLowerCase()).includes(fileSuffix) || videoType.map((m) => m.toUpperCase()).includes(fileSuffix)) {
                  plus.io.getVideoInfo({
                    filePath: path,
                    success(e) {
                      formatAppLog("log", "at pages/chat-detail/chat-detail.vue:185", "io-e", e);
                    }
                  });
                  self2.addMessage(path, "video");
                }
              });
            }, (err) => {
              formatAppLog("log", "at pages/chat-detail/chat-detail.vue:193", err);
            }, {
              multiple: true,
              permissionAlert: true,
              filter: "none"
            });
            break;
          case "camera":
            const camera = plus.camera.getCamera();
            camera.captureImage((path) => {
              plus.gallery.save(path, (path2) => {
                formatAppLog("log", "at pages/chat-detail/chat-detail.vue:206", "@success", path2);
              });
            }, (err) => {
              formatAppLog("log", "at pages/chat-detail/chat-detail.vue:209", err);
            });
            break;
          default:
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:214", "utils event err");
            break;
        }
      },
      changeInputState(event) {
        switch (event) {
          case "utils":
            this.popupBottomData = chatUtils;
            break;
          case "emo":
            this.popupBottomData = data;
            break;
          default:
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:229", "\u6CA1\u6709\u547D\u4E2D\u4E8B\u4EF6");
        }
        this.isChat = false;
        this.bottomClickTransition = true;
        this.bottomMode = event;
        this.isBottom = true;
        this.popShow = true;
        this.popupHeight = this.$refs.inputBar.activeKeyboardHeight;
        this.popPosition = { x: 0, y: 0 };
        setTimeout(() => {
          this.bottomClickTransition = false;
        }, 50);
      },
      addMessage(message, type, record_time) {
        const m = {
          id: Date.now(),
          user_id: 0,
          type,
          message_time: Date.now(),
          isUndone: false,
          isDel: false,
          data: type === "text" ? this.convertln(message) : message,
          user_image: "/static/logo.png",
          showTime: true
        };
        if (record_time) {
          m.record_time = record_time;
        }
        const lastIndex = this.userMessage.length - 1;
        const preTime = this.userMessage[lastIndex].message_time;
        const timeLimit = 1e3 * 60 * 10;
        m.showTime = m.message_time - preTime > timeLimit;
        this.userMessage.push(m);
        this.scrollBottom();
      },
      scrollBottom() {
        this.scrollHeight -= 100;
        setTimeout(() => this.scrollHeight += 100, 5);
      },
      convertln(target2) {
        let res = "";
        const patternln = /\n/g;
        const patternls = /\s/g;
        res = target2.replace(patternln, "<p></p>");
        res = res.replace(patternls, "&nbsp;");
        return res;
      },
      scroll(e) {
        setTimeout(() => this.scrollHeight = e.detail.scrollHeight, 10);
      },
      actionHandle(event) {
        switch (event) {
          case "undo":
            this.curUserMessage.isUndone = true;
            break;
          case "del":
            this.curUserMessage.isDel = true;
            break;
          default:
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:319", "\u6CA1\u6709\u6B64\u4E8B\u4EF6");
            break;
        }
      },
      handleTouch(target2, e) {
        this.touchStartTime = e.timeStamp;
        this.touchTarget = target2;
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        const maxY = device.screenHeight;
        x = x + 130 > maxX ? maxX - 130 : x;
        y = y + 300 > maxY ? maxY - 300 : y;
        y = y - 50 < 0 ? 50 : y;
        this.popPosition = { x, y };
      },
      handleLeave(message, e) {
        const endTime = e.timeStamp;
        if (this.touchStartTime && endTime - this.touchStartTime > 400) {
          this.isBottom = false;
          this.curUserMessage = message;
          const undoLimitTime = 1e3 * 60 * 3;
          const allowUndo = Date.now() - this.touchTarget.message_time < undoLimitTime && this.touchTarget.user_id === 0;
          this.popData = [
            {
              id: 1,
              content: "\u590D\u5236"
            },
            {
              id: 2,
              content: "\u53D1\u9001\u7ED9\u670B\u53CB"
            },
            {
              id: 3,
              content: allowUndo ? "\u64A4\u56DE" : "",
              event: "undo"
            },
            {
              id: 4,
              content: "\u5220\u9664",
              event: "del"
            },
            {
              id: 5,
              content: "\u6536\u85CF"
            }
          ];
          this.popShow = true;
          this.touchStartTime = 0;
        } else {
          this.popShow = false;
        }
      },
      handlePopHide() {
        this.popShow = false;
        if (this.isBottom) {
          this.$refs.inputBar.isOpenSwipeUtil = false;
          this.$refs.inputBar.isOpenEmo = false;
          this.$refs.inputBar.getInputHeight();
        }
      },
      synMoveDistance() {
        this.scrollViewHeight = this.$refs.inputBar.chatInputHeight;
        formatAppLog("log", "at pages/chat-detail/chat-detail.vue:404", "\u5F53\u524D\u79FB\u52A8\u7684\u9AD8\u5EA6", this.scrollViewHeight);
        this.scrollBottom();
      }
    },
    computed: {
      userChatMessage() {
        if (!this.isCompleteConvert) {
          this.userMessage[0].data = this.convertln(this.userMessage[0].data);
          for (let i2 = 1; i2 < this.userMessage.length; i2++) {
            const curTime = this.userMessage[i2].message_time;
            const preTime = this.userMessage[i2 - 1].message_time;
            const timeLimit = 1e3 * 60 * 10;
            this.userMessage[i2].showTime = curTime - preTime > timeLimit;
            this.userMessage[i2].data = this.convertln(this.userMessage[i2].data);
          }
          this.isCompleteConvert = true;
        }
        return this.userMessage;
      },
      imageArr() {
        const imageUrlStore = [];
        this.userMessage.forEach((o) => {
          if (o.type === "image") {
            imageUrlStore.push(o.data);
          }
        });
        return imageUrlStore;
      },
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_chat_item_detail = vue.resolveComponent("yx-chat-item-detail");
    const _component_yx_chat_detail_input = vue.resolveComponent("yx-chat-detail-input");
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(" \u5F97\u5230\u6700\u65B0\u7684\u70B9\u51FB\u65F6\u95F4\uFF0C\u907F\u514D\u51FA\u73B0\u70B9\u51FB\u6D88\u606F\uFF0C\u677E\u5F00\uFF0C\u53C8\u957F\u6309\u89E6\u53D1\u7684\u9519\u8BEF\u8BA1\u6570\u884C\u4E3A "),
      vue.createCommentVNode(' <view class="page" @touchstart="touchStartTime=Date.now()"> '),
      vue.createVNode(_component_yx_common_wrapper, null, {
        default: vue.withCtx(() => [
          vue.createCommentVNode(" \u5BFC\u822A\u680F ,\u9700\u8981\u5BF9\u70B9\u51FB\u7684\u804A\u5929\u6846\u505A\u5224\u65AD\uFF0C\u5224\u65AD\u4E3A\u7528\u6237\u8FD8\u662F\u7FA4\u7EC4\uFF0C\u4ED6\u4EEC\u53BB\u5F80\u7684\u8DEF\u7531\u4E0D\u540C"),
          vue.createVNode(_component_yx_nav_bar, {
            title: $data.name,
            requireOccupy: false,
            isChat: true,
            routerPath: `/pages/chat-detail/chat-about-group-setting/chat-about-group-setting?${$data.name}`
          }, null, 8, ["title", "routerPath"]),
          vue.createCommentVNode(" \u6ED1\u52A8\u5185\u5BB9 "),
          vue.createElementVNode("scroll-view", {
            "scroll-y": "true",
            onScroll: _cache[1] || (_cache[1] = (...args) => $options.scroll && $options.scroll(...args)),
            "scroll-top": $data.scrollHeight,
            class: "position-fixed",
            style: vue.normalizeStyle(`top:${95 + _ctx.fixedTop}rpx;bottom:${$data.scrollViewHeight}rpx`)
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.userChatMessage, (message) => {
              return vue.openBlock(), vue.createBlock(_component_yx_chat_item_detail, {
                key: message.id,
                onClick: _cache[0] || (_cache[0] = ($event) => {
                  $data.isChat = true;
                  $data.isBottom = false;
                }),
                chatMessage: message
              }, null, 8, ["chatMessage"]);
            }), 128)),
            vue.createCommentVNode(' 	<yx-chat-item-detail v-for="message in userChatMessage" :key="message.id" :chatMessage="message"\r\n				 @touchend="(e)=>handleLeave(message,e)"></yx-chat-item-detail> ')
          ], 44, ["scroll-top"]),
          vue.createCommentVNode(" \u8F93\u5165\u6846 "),
          vue.createVNode(_component_yx_chat_detail_input, {
            onAddMessage: $options.addMessage,
            ref: "inputBar",
            onHide: $options.handlePopHide,
            onSyn: $options.synMoveDistance,
            onActiveUtil: $options.changeInputState
          }, null, 8, ["onAddMessage", "onHide", "onSyn", "onActiveUtil"]),
          vue.createVNode(_component_yx_popup, {
            show: $data.popShow,
            popPosittion: $data.popPosition,
            popHeight: $data.popupHeight,
            isChat: $data.isChat,
            utilArr: $data.utilArr,
            emoArr: $data.emoArr,
            bottomMode: $data.bottomMode,
            bottomClickTransition: $data.bottomClickTransition,
            isDark: $data.popIsDark,
            popItem: $data.popData,
            isBottom: $data.isBottom,
            popupContentOfUtilInBottom: $data.popupBottomData,
            onHide: $options.handlePopHide,
            onAction: $options.actionHandle
          }, {
            util: vue.withCtx(() => [
              $data.bottomMode == "utils" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                vue.createElementVNode("swiper", {
                  style: { "height": "500rpx", "width": "100%" },
                  circular: "",
                  "indicator-dots": true,
                  duration: 100
                }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.utilArr, (itemArr) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", {
                      style: { "height": "100%" },
                      class: vue.normalizeClass($data.bottomClickTransition ? "opacity-0" : "opacity-1")
                    }, [
                      vue.createElementVNode("view", { class: "flex justify-between zTop flex-wrap" }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(itemArr, (item) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            onClick: ($event) => $options.utilEventHandle(item.event),
                            key: item.id,
                            style: { "flex": "0 0 25%", "height": "200rpx" },
                            class: "justify-center flex flex-column align-center mt-1"
                          }, [
                            vue.createElementVNode("image", {
                              src: item.img_src,
                              mode: "aspectFit",
                              style: { "height": "70%", "width": "70%" }
                            }, null, 8, ["src"]),
                            vue.createElementVNode("text", null, vue.toDisplayString(item.text), 1)
                          ], 8, ["onClick"]);
                        }), 128))
                      ])
                    ], 2);
                  }), 256))
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            emo: vue.withCtx(() => [
              $data.bottomMode == "emo" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                vue.createElementVNode("scroll-view", {
                  "scroll-y": true,
                  class: "transition-ease-fast",
                  style: { "height": "550rpx" }
                }, [
                  vue.createElementVNode("view", {
                    style: { "height": "100%" },
                    class: vue.normalizeClass($data.bottomClickTransition ? "opacity-0" : "opacity-1")
                  }, [
                    vue.createElementVNode("view", { class: "grid justify-between zTop grid-3" }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.emoArr, (emoItem) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          onClick: ($event) => $options.addMessage(emoItem.img_src, "image"),
                          key: emoItem.id,
                          style: { "flex": "0 0 25%", "height": "200rpx" },
                          class: "justify-center flex flex-column align-center mt-1"
                        }, [
                          vue.createElementVNode("image", {
                            src: emoItem.img_src,
                            mode: "aspectFit",
                            style: { "height": "50%", "width": "50%" }
                          }, null, 8, ["src"]),
                          vue.createElementVNode("text", null, vue.toDisplayString(emoItem.text), 1)
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ], 2)
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            _: 1
          }, 8, ["show", "popPosittion", "popHeight", "isChat", "utilArr", "emoArr", "bottomMode", "bottomClickTransition", "isDark", "popItem", "isBottom", "popupContentOfUtilInBottom", "onHide", "onAction"])
        ]),
        _: 1
      })
    ], 2112);
  }
  const PagesChatDetailChatDetail = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/chat-detail/chat-detail.vue"]]);
  const _sfc_main$e = {
    name: "yx-list-compo",
    props: {
      listData: [Object]
    },
    mounted() {
      setTimeout(
        () => {
          formatAppLog("log", "at components/yx-list-compo.vue:28", "list_----", this.listData);
        },
        100
      );
    },
    components: { YxList },
    data() {
      return {};
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_list = vue.resolveComponent("yx-list");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.listData, (list) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "mb-2 bg-white" }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list, (data2) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              title: data2.title,
              isCell: data2.isCell,
              key: data2.id
            }, vue.createSlots({ _: 2 }, [
              data2.suffix || data2.sign ? {
                name: "suffix",
                fn: vue.withCtx(() => [
                  data2.suffix ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, vue.toDisplayString(data2.suffix), 1)) : vue.createCommentVNode("v-if", true),
                  data2.sign === "qrCode" ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 1,
                    class: "iconfont icon-qrcode"
                  })) : vue.createCommentVNode("v-if", true),
                  data2.sign === "switch" ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                    vue.createElementVNode("switch", {
                      onChange: (e) => _ctx.switchToggle(e, data2)
                    }, null, 40, ["onChange"])
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "isCell"]);
          }), 128))
        ]);
      }), 256))
    ]);
  }
  const YxListCompo = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-list-compo.vue"]]);
  const _sfc_main$d = {
    onLoad(query) {
      formatAppLog("log", "at pages/chat-detail/chat-about-group-setting/chat-about-group-setting.vue:55", "query", query);
      this.title = query.title;
    },
    components: {
      YxNavBar,
      YxList,
      YxCommonWrapper,
      YxListCompo,
      YxFlexibleWrapper
    },
    mounted() {
      this.listData = [
        [
          {
            id: Math.random() * 2e3,
            title: "\u7FA4\u804A\u540D\u79F0",
            suffix: "\u4E00\u5BB6\u4EBA",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u7FA4\u4E8C\u7EF4\u7801",
            sign: "qrCode",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u7FA4\u516C\u544A",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u5907\u6CE8",
            isCell: true
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u6D88\u606F\u514D\u6253\u6270",
            isCell: true
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u7F6E\u9876\u804A\u5929",
            sign: "switch",
            isCell: false
          },
          {
            id: Math.random() * 2e3,
            title: "\u4FDD\u5B58\u5230\u901A\u8BAF\u5F55",
            sign: "switch",
            isCell: false
          },
          {
            id: Math.random() * 2e3,
            title: "\u67E5\u770B\u804A\u5929\u8BB0\u5F55",
            sign: "switch",
            isCell: false
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u6211\u5728\u7FA4\u91CC\u7684\u6635\u79F0",
            suffix: "\u5E05\u6C14",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u663E\u793A\u7FA4\u6210\u5458\u6635\u79F0",
            sign: "switch",
            isCell: false
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u8BBE\u7F6E\u5F53\u524D\u804A\u5929\u80CC\u666F",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u6E05\u7A7A\u804A\u5929\u8BB0\u5F55",
            isCell: true
          },
          {
            id: Math.random() * 2e3,
            title: "\u6295\u8BC9",
            isCell: true
          }
        ]
      ];
      formatAppLog("log", "at pages/chat-detail/chat-about-group-setting/chat-about-group-setting.vue:145", "@list,id", this.listData);
    },
    data() {
      return {
        title: "",
        listData: ""
      };
    },
    methods: {
      switchToggle(e, target2) {
        formatAppLog("log", "at pages/chat-detail/chat-about-group-setting/chat-about-group-setting.vue:155", "switch\u5207\u6362", e, target2);
      }
    },
    computed: {
      ...mapState(useDeviceStore, ["fixedTop"])
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, null, {
      default: vue.withCtx(() => [
        vue.createCommentVNode(' <view class="bg-common fill-screen font-md"> '),
        vue.createVNode(_component_yx_nav_bar, {
          existMore: false,
          title: $data.title
        }, null, 8, ["title"]),
        vue.createCommentVNode(' <scroll-view scroll-y="true" class="position-fixed font-sm"  :style="`top:${fixedTop+90}rpx;height:88vh`"> '),
        vue.createVNode(_component_yx_flexible_wrapper, { height: "93vh" }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", {
              id: "group-member",
              class: "bg-white p-1"
            }, [
              vue.createCommentVNode(" \u6700\u591A\u663E\u793A19\u4E2A\u89D2\u8272\u5934\u50CF\uFF0C\u6BCF\u884C5\u4E2A\uFF0C\u6700\u672B\u5C3E\u7684\u4E00\u4E2A\u4F7F\u7528\u6DFB\u52A0\u7B26\u53F7\u5360\u4F4D(\u5982\u53EA\u6709\u4E24\u4E2A\u5219\uFF0C\u4E24\u4E2A\u7528\u6237\u6B63\u5E38\u663E\u793A\uFF0C\u6C14\u5019\u8DDF\u7740\u4E00\u4E2A\u6DFB\u52A0\u53F7\u5360\u4F4D\uFF08\u663E\u793A\u4E00\u884C\uFF09\uFF0C\u5982\u5927\u4E8E20\u4E2A\u7528\u6237\uFF0C\u663E\u793A19\u4E2A\u6700\u540E\u4E00\u4E2A\u4F7F\u7528\u6DFB\u52A0\u7B26\u53F7\u5360\u4F4D) "),
              vue.createCommentVNode(" \u671F\u5F85\u540E\u7EED\u8865\u5145\uFF0C\u5F97\u5230\u7FA4\u7EC4\u7684\u6240\u6709\u6210\u5458\u8FDB\u884C\u5C55\u793A\uFF0C\u6837\u5F0F\u548C\u5360\u4F4D\u7B26\u76F8\u4F3C "),
              vue.createCommentVNode(" \u5360\u4F4D\u6DFB\u52A0\u7B26\u53F7 "),
              vue.createElementVNode("view", { class: "grid grid-5 grid-gap-1 justify-between" }, [
                vue.createElementVNode("view", {
                  class: "rounded font-lg text-center ml-2 cursor-pointer",
                  style: { "width": "100rpx", "height": "100rpx", "line-height": "100rpx", "border": "2rpx dashed #ccc" }
                }, " + ")
              ]),
              vue.createElementVNode("view", { class: "text-center text-common mb-2" }, "\u67E5\u770B\u66F4\u591A\u7FA4\u6210\u5458 > ")
            ]),
            vue.createElementVNode("view", {
              id: "detail-setting-operate",
              class: "mt-2"
            }, [
              vue.createCommentVNode(" \u4F7F\u7528 list-compo\u96C6\u5408\u6570\u636E\u53EF\u80FD\u51FA\u73B0\u4E8B\u4EF6\u5904\u7406\u6324\u5151\uFF0C\u5373\u6240\u6709\u7684\u53EF\u80FD\u884C\u90FD\u9700\u8981\u5728yx-list-compo\u7EC4\u4EF6\u5185\u8FDB\u884C\u5B8C\u6210\uFF0C\u53EF\u80FD\u4E0D\u662F\u4E00\u4E2A\u597D\u7684\u9009\u62E9 "),
              vue.createCommentVNode(` 	<yx-list-compo :listData="listData">\r
					<view v-if="data.suffix">{{data.suffix}}</view>\r
					<text v-if="data.sign === 'qrCode'" class="iconfont icon-qrcode" ></text>\r
					<view v-if="data.sign === 'switch'">\r
						<switch @change="(e)=>switchToggle(e,data)" />\r
					</view>\r
				</yx-list-compo> `),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.listData, (list) => {
                return vue.openBlock(), vue.createElementBlock("view", { class: "mb-2 bg-white" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list, (data2) => {
                    return vue.openBlock(), vue.createBlock(_component_yx_list, {
                      title: data2.title,
                      isCell: data2.isCell,
                      key: data2.id
                    }, vue.createSlots({ _: 2 }, [
                      data2.suffix || data2.sign ? {
                        name: "suffix",
                        fn: vue.withCtx(() => [
                          data2.suffix ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, vue.toDisplayString(data2.suffix), 1)) : vue.createCommentVNode("v-if", true),
                          data2.sign === "qrCode" ? (vue.openBlock(), vue.createElementBlock("text", {
                            key: 1,
                            class: "iconfont icon-qrcode"
                          })) : vue.createCommentVNode("v-if", true),
                          data2.sign === "switch" ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                            vue.createElementVNode("switch", {
                              onChange: (e) => $options.switchToggle(e, data2)
                            }, null, 40, ["onChange"])
                          ])) : vue.createCommentVNode("v-if", true)
                        ]),
                        key: "0"
                      } : void 0
                    ]), 1032, ["title", "isCell"]);
                  }), 128))
                ]);
              }), 256))
            ]),
            vue.createElementVNode("view", { class: "text-center font-md text-danger bg-white p-2" }, "\u9000\u51FA\u7FA4\u804A"),
            vue.createCommentVNode(" </scroll-view> ")
          ]),
          _: 1
        }),
        vue.createCommentVNode(" </view> ")
      ]),
      _: 1
    });
  }
  const PagesChatDetailChatAboutGroupSettingChatAboutGroupSetting = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/chat-detail/chat-about-group-setting/chat-about-group-setting.vue"]]);
  const _sfc_main$c = {
    onLoad(query) {
      formatAppLog("log", "at pages/UserInfo/UserInfo.vue:42", "query", query);
      this.targetId = query.id;
    },
    components: {
      YxNavBar,
      YxList,
      YxCard,
      YxFlexibleWrapper
    },
    mounted() {
      this.listData = [
        [
          {
            id: Math.random() * 2e3,
            title: "\u8BBE\u7F6E\u6807\u7B7E\u548C\u6635\u79F0",
            isCell: true,
            event: "tag"
          },
          {
            id: Math.random() * 2e3,
            title: "\u7535\u8BDD\u53F7\u7801",
            suffix: "11203",
            sign: "tel",
            isCell: false
          },
          {
            id: Math.random() * 2e3,
            title: "\u670B\u53CB\u6743\u9650",
            isCell: true,
            event: "auth"
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u670B\u53CB\u5708",
            sign: "image",
            isCell: true,
            event: "friend"
          },
          {
            id: Math.random() * 2e3,
            title: "\u66F4\u591A\u4FE1\u606F",
            isCell: true,
            event: "moreMsg"
          }
        ]
      ];
    },
    data() {
      return {
        targetId: "",
        listData: []
      };
    },
    methods: {
      toChat() {
        this.routerGo("/pages/chat-detail/chat-detail");
      },
      handleEvent(data2) {
        switch (data2.event) {
          case "tag":
            this.routerGo("/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag");
            break;
          case "auth":
            this.routerGo("/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth");
            break;
          case "moreMsg":
            this.routerGo("/pages/UserInfo/UserCustomSetting/UserCustomSetting");
            break;
          case "friend":
            this.routerGo("/pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_card = vue.resolveComponent("yx-card");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock("view", { class: "fill-screen bg-common" }, [
      vue.createVNode(_component_yx_nav_bar, {
        routerPath: `/pages/UserInfo/UserCustomSetting/UserCustomSetting?id=${$data.targetId}`
      }, null, 8, ["routerPath"]),
      vue.createVNode(_component_yx_flexible_wrapper, null, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_yx_card, {
            img: "/static/logo.png",
            class: "bg-white font-weight-bold",
            title: "\u6D4B\u8BD5"
          }, {
            desc: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "m-1" }, "\u6635\u79F0: \u6211\u662F\u6635\u79F0"),
              vue.createElementVNode("view", { class: "m-1" }, "\u5FAE\u4FE1\u53F7: qiDaiTianChong"),
              vue.createElementVNode("view", { class: "m-1" }, "\u5730\u533A\uFF1A\u6E56\u5317 \u6B66\u6C49")
            ]),
            right: vue.withCtx(() => [
              vue.createCommentVNode(" \u5982\u679C\u662F\u5173\u5FC3\u7528\u6237\u5219\u8FDB\u884C\u663E\u793A\uFF0C\u901A\u8FC7\u540E\u53F0\u5B57\u6BB5\u8FD4\u56DE "),
              vue.createElementVNode("text", {
                style: { "color": "#ffbf01" },
                class: "font-lg iconfont icon-aixin-xian"
              }),
              vue.createCommentVNode(" \u2665\u2B50\u{1F9E1}\u{1F31F}\u2B50\u{1F31F} ")
            ]),
            _: 1
          }),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.listData, (list) => {
            return vue.openBlock(), vue.createElementBlock("view", { class: "mb-2 bg-white" }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list, (data2) => {
                return vue.openBlock(), vue.createBlock(_component_yx_list, {
                  onClick: ($event) => $options.handleEvent(data2),
                  title: data2.title,
                  isCell: data2.isCell,
                  key: data2.id
                }, vue.createSlots({ _: 2 }, [
                  data2.suffix || data2.sign ? {
                    name: "suffix",
                    fn: vue.withCtx(() => [
                      data2.suffix ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        style: { "width": "550rpx" },
                        class: vue.normalizeClass(data2.sign === "tel" ? "text-danger" : "")
                      }, vue.toDisplayString(data2.suffix), 3)) : vue.createCommentVNode("v-if", true),
                      data2.sign === "image" ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        style: { "width": "520rpx" }
                      }, [
                        vue.createElementVNode("image", {
                          style: { "width": "75rpx", "height": "75rpx" },
                          src: "/static/images/demo/cate_09.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode("image", {
                          style: { "width": "75rpx", "height": "75rpx" },
                          src: "/static//logo.png",
                          mode: "aspectFit"
                        })
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    key: "0"
                  } : void 0
                ]), 1032, ["onClick", "title", "isCell"]);
              }), 128))
            ]);
          }), 256)),
          vue.createElementVNode("view", {
            class: "text-center font-md bg-white p-2",
            style: { "color": "#6b859a" },
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toChat && $options.toChat(...args))
          }, "\u53D1\u9001\u6D88\u606F"),
          vue.createCommentVNode(" \u6839\u636E\u540E\u53F0\u5B57\u6BB5\u67E5\u770B\u662F\u5426\u88AB\u6DFB\u52A0\u5230\u9ED1\u540D\u5355 "),
          vue.createElementVNode("view", { class: "mt-2 font-small text-common-font text-center" }, "\u5DF2\u52A0\u5165\u9ED1\u540D\u5355\uFF0C\u4F60\u5C06\u65E0\u6CD5\u63A5\u53D7\u5230\u5B83\u7684\u6D88\u606F")
        ]),
        _: 1
      })
    ]);
  }
  const PagesUserInfoUserInfo = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserInfo.vue"]]);
  const _sfc_main$b = {
    onLoad(query) {
    },
    components: {
      YxNavBar,
      YxList,
      YxFlexibleWrapper
    },
    mounted() {
      this.listData = [
        [
          {
            id: Math.random() * 2e3,
            title: "\u8BBE\u7F6E\u5907\u6CE8\u548C\u6807\u7B7E",
            isCell: true,
            event: "tag"
          },
          {
            id: Math.random() * 2e3,
            title: "\u670B\u53CB\u6743\u9650",
            isCell: true,
            event: "auth"
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u628A\u5B83\u63A8\u8350\u7ED9\u670B\u53CB",
            isCell: true,
            event: "recommend"
          },
          {
            id: Math.random() * 2e3,
            title: "\u8BBE\u4E3A\u661F\u6807\u670B\u53CB",
            sign: "switch"
          }
        ],
        [
          {
            id: Math.random() * 2e3,
            title: "\u52A0\u5165\u9ED1\u540D\u5355",
            sign: "switch"
          },
          {
            id: Math.random() * 2e3,
            title: "\u6295\u8BC9",
            isCell: true
          }
        ]
      ];
    },
    data() {
      return {
        targetId: "",
        listData: []
      };
    },
    methods: {
      handleObjEvent(data2) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/UserCustomSetting.vue:83", "data", data2);
        switch (data2.event) {
          case "tag":
            this.routerGo("/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag");
            break;
          case "auth":
            this.routerGo("/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth");
            break;
          case "recommend":
            this.routerGo("/pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend");
            break;
          default:
            formatAppLog("log", "at pages/UserInfo/UserCustomSetting/UserCustomSetting.vue:95", "\u65E0\u6CD5\u5904\u7406\u6B64\u914D\u7F6E");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock("view", { class: "fill-screen bg-common" }, [
      vue.createVNode(_component_yx_nav_bar, {
        title: "\u8D44\u6599\u8BBE\u7F6E",
        class: "mb-4",
        existMore: false
      }),
      vue.createVNode(_component_yx_flexible_wrapper, null, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.listData, (list, i2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "mb-2 bg-white",
              key: i2
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list, (data2) => {
                return vue.openBlock(), vue.createBlock(_component_yx_list, {
                  onClick: ($event) => $options.handleObjEvent(data2),
                  title: data2.title,
                  isCell: data2.isCell,
                  key: data2.id
                }, vue.createSlots({ _: 2 }, [
                  data2.suffix || data2.sign ? {
                    name: "suffix",
                    fn: vue.withCtx(() => [
                      data2.sign === "switch" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                        vue.createElementVNode("switch", {
                          onChange: (e) => _ctx.switchToggle(e, data2)
                        }, null, 40, ["onChange"])
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    key: "0"
                  } : void 0
                ]), 1032, ["onClick", "title", "isCell"]);
              }), 128))
            ]);
          }), 128)),
          vue.createElementVNode("view", { class: "text-center font-md bg-white p-2 text-danger" }, "\u5220\u9664")
        ]),
        _: 1
      })
    ]);
  }
  const PagesUserInfoUserCustomSettingUserCustomSetting = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/UserCustomSetting.vue"]]);
  const _sfc_main$a = {
    components: {
      YxNavBar,
      YxFlexibleWrapper
    },
    data() {
      return {};
    },
    methods: {
      routerPath(path) {
        uni.navigateTo({
          url: path
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_YxFlexibleWrapper = vue.resolveComponent("YxFlexibleWrapper");
    return vue.openBlock(), vue.createElementBlock("view", { class: "bg-white" }, [
      vue.createVNode(_component_yx_nav_bar, { existMore: false }, {
        suffix: vue.withCtx(() => [
          vue.createElementVNode("button", {
            size: "mini",
            class: "text-white main-bg-color"
          }, "\u5B8C\u6210")
        ]),
        _: 1
      }),
      vue.createVNode(_component_YxFlexibleWrapper, null, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "p-2 mt-5" }, [
            vue.createElementVNode("view", { class: "text-center px-2 font-weight-bold font-md" }, " \u8BBE\u7F6E\u5907\u6CE8\u548C\u6807\u7B7E "),
            vue.createElementVNode("view", { class: "p-1" }, [
              vue.createElementVNode("view", { class: "m-1" }, "\u5907\u6CE8"),
              vue.createElementVNode("view", { class: "p-2 rounded bg-common" }, [
                vue.createElementVNode("input", { type: "text" })
              ])
            ]),
            vue.createElementVNode("view", {
              class: "p-1",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.routerPath("/pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick"))
            }, [
              vue.createElementVNode("view", { class: "m-1" }, "\u6807\u7B7E"),
              vue.createElementVNode("view", { class: "p-2 rounded bg-common font-md justify-around flex" }, [
                vue.createElementVNode("view", { class: "flex-1" }, "\u6DFB\u52A0\u6807\u7B7E"),
                vue.createElementVNode("view", null, ">")
              ])
            ]),
            vue.createElementVNode("view", { class: "p-1" }, [
              vue.createElementVNode("view", { class: "m-1" }, "\u7535\u8BDD\u53F7\u7801"),
              vue.createElementVNode("view", { class: "rounded bg-common font-md justify-around flex" }, [
                vue.createElementVNode("view", { class: "ml-2 p-1 font-lg" }, "+"),
                vue.createElementVNode("input", {
                  type: "text",
                  class: "mt-1 flex-1"
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "p-1" }, [
              vue.createElementVNode("view", { class: "m-1" }, "\u63CF\u8FF0"),
              vue.createElementVNode("view", { class: "p-2 rounded bg-common font-md justify-around flex" }, [
                vue.createElementVNode("input", {
                  type: "text",
                  class: "flex-1",
                  placeholder: "\u6DFB\u52A0\u6587\u5B57\u63CF\u8FF0"
                })
              ])
            ])
          ])
        ]),
        _: 1
      })
    ]);
  }
  const PagesUserInfoUserCustomSettingSetUserTagSetUserTag = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag.vue"]]);
  const _sfc_main$9 = {
    components: {
      YxNavBar,
      YxCommonWrapper
    },
    mounted() {
      this.tagList.push(
        { id: Math.random() * 1e3, title: "+ \u65B0\u5EFA\u6807\u7B7E", oftenExist: true },
        { id: Math.random() * 1e3, title: "\u4FC4\u5F0F", isSelected: false },
        { id: Math.random() * 1e3, title: "+ \u5927\u54E5", isSelected: false }
      );
    },
    data() {
      return {
        tagList: [],
        tagVal: "",
        creatingTag: false,
        userTag: []
      };
    },
    methods: {
      createTag(val) {
        return { id: Math.random() * 1e3, title: val };
      },
      createTagBox(tag) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick.vue:68", tag);
        if (tag.oftenExist) {
          this.creatingTag = true;
        } else {
          tag.isSelected = !tag.isSelected;
          if (tag.isSelected) {
            this.userTag.unshift(tag);
          } else {
            const i2 = this.userTag.findIndex((obj) => obj.id === tag.id);
            this.userTag.splice(i2, 1);
          }
        }
      },
      inputCheck(e) {
        this.tagVal = e.detail.value;
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick.vue:84", this.tagVal.length);
        if (this.tagVal.length >= 10) {
          uni.showToast({
            title: "\u6700\u591A\u53EA\u80FD\u8F93\u516510\u4E2A\u5B57",
            icon: "none",
            duration: 500
          });
        }
      },
      hideInputBox(type) {
        switch (type) {
          case "create":
            if (this.tagVal.length) {
              this.tagList.push(this.createTag(this.tagVal));
              this.tagVal = "";
            }
            break;
        }
        this.creatingTag = false;
      },
      goBack() {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick.vue:107", "\u8FD4\u56DE");
        uni.navigateBack();
      }
    },
    computed: {}
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, { class: "position-relative" }, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_nav_bar, {
          existMore: false,
          titleCenter: true,
          title: "\u4ECE\u5168\u90E8\u6807\u7B7E\u4E2D\u6DFB\u52A0"
        }, {
          suffix: vue.withCtx(() => [
            vue.createElementVNode("button", {
              size: "mini",
              class: "text-white main-bg-color",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
            }, "\u5B8C\u6210")
          ]),
          _: 1
        }),
        vue.createElementVNode("view", { class: "bg-white pt-5" }, [
          vue.createElementVNode("text", { class: "font-small text-common pl-2" }, "\u4ECE\u4EE5\u4E0B\u6807\u7B7E\u8FDB\u884C\u9009\u62E9"),
          vue.createElementVNode("view", { class: "text-common p-3 flex font-small flex-wrap align-center" }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userTag, (tag) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: tag.id,
                onClick: ($event) => $options.createTagBox(tag),
                class: vue.normalizeClass([tag.isSelected ? "bg-white main-bg-color text-white " : "bg-white", "p-1 px-2 mr-2 mt-2 rounded-circle"])
              }, vue.toDisplayString(tag.title), 11, ["onClick"]);
            }), 128)),
            vue.createElementVNode("view", { class: "flex font-sm mt-2" }, " \u9009\u62E9\u6807\u7B7E ")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "p-2 text-white",
          style: { "color": "#9ca3af" }
        }, [
          vue.createElementVNode("view", { class: "flex justify-between font-sm" }, [
            vue.createElementVNode("view", null, "\u5168\u90E8\u6807\u7B7E"),
            vue.createElementVNode("view", null, "\u7F16\u8F91 > ")
          ]),
          vue.createElementVNode("view", {
            class: "mt-1 flex flex-wrap",
            id: "tag-region-choose",
            style: { "font-size": "22rpx" }
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.tagList, (tag) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: tag.id,
                onClick: ($event) => $options.createTagBox(tag),
                class: vue.normalizeClass([tag.oftenExist ? "border " : tag.isSelected ? "bg-white main-bg-color text-white " : "bg-white", "p-1 px-2 mr-2 mt-2 rounded-circle"])
              }, vue.toDisplayString(tag.title), 11, ["onClick"]);
            }), 128))
          ])
        ]),
        vue.createElementVNode("view", {
          id: "create-tag-region",
          class: vue.normalizeClass(["flex align-center flex-row position-absolute zTop bg-white p-2 rounded", $data.creatingTag ? "display-block" : "display-none"]),
          style: { "left": "50rpx", "top": "450rpx", "width": "300rpx" }
        }, [
          vue.createElementVNode("textarea", {
            maxlength: 10,
            "auto-height": "",
            class: "font-small",
            value: $data.tagVal,
            onInput: _cache[1] || (_cache[1] = (...args) => $options.inputCheck && $options.inputCheck(...args))
          }, null, 40, ["value"]),
          vue.createElementVNode("button", {
            onClick: _cache[2] || (_cache[2] = ($event) => $options.hideInputBox("create")),
            class: "text-white main-bg-color mt-1 font-small",
            style: { "height": "50rpx", "line-height": "50rpx" }
          }, "\u786E\u5B9A")
        ], 2),
        vue.createElementVNode("view", {
          id: "mask",
          class: vue.normalizeClass(["fill-screen bg-danger lucency-hide position-absolute", $data.creatingTag ? "display-block" : "display-none"]),
          onClick: _cache[3] || (_cache[3] = (...args) => $options.hideInputBox && $options.hideInputBox(...args)),
          style: { "left": "0", "top": "0" }
        }, null, 2)
      ]),
      _: 1
    });
  }
  const PagesUserInfoUserCustomSettingSetUserTagTagPickTagPick = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick.vue"]]);
  const _sfc_main$8 = {
    onLoad(query) {
    },
    components: {
      YxNavBar,
      YxList,
      YxCommonWrapper,
      YxFlexibleWrapper
    },
    mounted() {
      this.listData = [
        {
          title: "\u8BBE\u7F6E\u670B\u53CB\u6743\u9650",
          list: [
            {
              id: Math.random() * 2e3,
              title: "\u804A\u5929\u3001\u670B\u53CB\u5708\u7B49",
              sign: "auth",
              radio: true,
              event: "moreAuth"
            },
            {
              id: Math.random() * 2e3,
              title: "\u4EC5\u804A\u5929",
              sign: "auth",
              radio: false,
              event: "chat"
            }
          ]
        },
        {
          title: "\u670B\u53CB\u5708\u548C\u72B6\u6001",
          list: [
            {
              id: Math.random() * 2e3,
              title: "\u4E0D\u8BA9\u4ED6\u770B\u6211",
              sign: "switch",
              event: "forbidSeekMe"
            },
            {
              id: Math.random() * 2e3,
              title: "\u4E0D\u770B\u5B83",
              sign: "switch",
              event: "notSeekIt"
            }
          ]
        }
      ];
    },
    data() {
      return {
        targetId: "",
        listData: []
      };
    },
    methods: {
      handleObjEvent(data2) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/UserAuth/UserAuth.vue:81", "data", data2);
        switch (data2.event) {
          case "chat":
          case "moreAuth":
            data2.radio = true;
            const authList = this.authList;
            authList.filter((list) => list.id !== data2.id).forEach((list) => list.radio = false);
            break;
          default:
            formatAppLog("log", "at pages/UserInfo/UserCustomSetting/UserAuth/UserAuth.vue:90", "\u65E0\u6CD5\u5904\u7406\u6B64\u914D\u7F6E");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      }
    },
    computed: {
      authList() {
        return this.listData[0].list;
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, null, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_nav_bar, {
          title: "\u670B\u53CB\u6743\u9650",
          existMore: false
        }),
        vue.createVNode(_component_yx_flexible_wrapper, null, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.listData, (list) => {
              return vue.openBlock(), vue.createElementBlock("view", { class: "mt-2" }, [
                vue.createElementVNode("view", { class: "font-small my-1 mx-2 text-common-font" }, vue.toDisplayString(list.title), 1),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list.list, (data2) => {
                  return vue.openBlock(), vue.createBlock(_component_yx_list, {
                    title: data2.title,
                    onClick: ($event) => $options.handleObjEvent(data2),
                    class: "bg-white px-2",
                    key: data2.id
                  }, {
                    suffix: vue.withCtx(() => [
                      data2.sign === "switch" ? (vue.openBlock(), vue.createElementBlock("switch", {
                        key: 0,
                        checked: "true",
                        onChange: _cache[0] || (_cache[0] = () => {
                        })
                      }, null, 32)) : vue.createCommentVNode("v-if", true),
                      data2.sign === "auth" && data2.radio ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
                        vue.createElementVNode("text", { class: "main-text-color" }, " \u221A ")
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    _: 2
                  }, 1032, ["title", "onClick"]);
                }), 128))
              ]);
            }), 256))
          ]),
          _: 1
        })
      ]),
      _: 1
    });
  }
  const PagesUserInfoUserCustomSettingUserAuthUserAuth = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth.vue"]]);
  const _sfc_main$7 = {
    onLoad(query) {
    },
    components: {
      YxNavBar,
      YxList,
      YxCommonWrapper,
      YxPopup
    },
    mounted() {
      this.userList = this.userList.map((user) => {
        user.isSelected = false;
        return user;
      });
      this.userTopList = this.userList.filter((user) => user.is_top);
      this.recentContact = [...this.userList].splice(2, 2);
      plus.key.addEventListener("keyup", (e) => {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue:135", "key", e);
      });
    },
    data() {
      return {
        targetId: "",
        selectedUserList: [],
        userTopList: [],
        recentContact: [],
        userList,
        sendSingle: true,
        selectedTargetInMoreChoseMode: false,
        show: false,
        popPosition: {
          x: 140,
          y: 400
        },
        selectedCount: 0,
        havingSearchUser: false,
        searchVal: ""
      };
    },
    methods: {
      inputWatcher(e) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue:163", "\u8F93\u5165", e);
        if (!this.sendSingle && this.searchVal.length === 0 && this.selectedUserList.length) {
          const last = this.selectedUserList.length - 1;
          this.selectedUserList[last].isSelected = false;
          this.selectedUserList.pop();
        }
      },
      handleObjEvent(data2) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue:171", "data", data2);
        switch (data2.event) {
          case "chat":
          case "moreAuth":
            data2.radio = true;
            const authList = this.authList;
            authList.filter((list) => list.id !== data2.id).forEach((list) => list.radio = false);
            break;
          default:
            formatAppLog("log", "at pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue:180", "\u65E0\u6CD5\u5904\u7406\u6B64\u914D\u7F6E");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      },
      sendToIt(user) {
        if (this.sendSingle) {
          this.selectedTargetInMoreChoseMode = false;
          this.selectedUserList.push(user);
          this.show = true;
        } else {
          this.selectedTargetInMoreChoseMode = true;
          user.isSelected = !user.isSelected;
          if (user.isSelected) {
            this.selectedUserList.push(user);
          } else {
            const i2 = this.selectedUserList.findIndex((u) => user.id == u.id);
            this.selectedUserList.splice(i2, 1);
          }
        }
      },
      changeSelectedMode() {
        this.sendSingle = !this.sendSingle;
      },
      hidePopup() {
        if (this.sendSingle) {
          this.selectedUserList = [];
        }
        this.show = false;
      },
      sendDataToUser() {
        this.show = true;
      },
      handleSearchUser(e) {
      }
    },
    computed: {
      authList() {
        return this.listData[0].list;
      },
      userListOfNotTop() {
        return this.userList.filter((user) => !user.is_top);
      }
    },
    watch: {
      userList: {
        deep: true,
        handler() {
          formatAppLog("log", "at pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue:240", "c", userList.filter((user) => user.isSelected).length);
          this.selectedCount = userList.filter((user) => user.isSelected).length;
          if (this.selectedCount === 0) {
            this.selectedTargetInMoreChoseMode = false;
          }
        }
      },
      searchVal() {
        this.havingSearchUser = this.searchVal.length > 0;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    const _component_yx_common_wrapper = vue.resolveComponent("yx-common-wrapper");
    return vue.openBlock(), vue.createBlock(_component_yx_common_wrapper, null, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_yx_nav_bar, {
          titleCenter: true,
          title: `\u9009\u62E9${$data.sendSingle ? "\u4E00" : "\u591A"}\u4E2A\u804A\u5929`,
          existMore: false
        }, {
          suffix: vue.withCtx(() => [
            vue.createCommentVNode(" \u5355\u9009\u6A21\u5F0F\u6216\u591A\u9009\u6A21\u5F0F\u6CA1\u6709\u9009\u62E9\u65F6\u5C55\u793A\u6B64 "),
            !$data.selectedTargetInMoreChoseMode ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              onClick: _cache[0] || (_cache[0] = (...args) => $options.changeSelectedMode && $options.changeSelectedMode(...args))
            }, vue.toDisplayString($data.sendSingle ? "\u591A" : "\u5355") + "\u9009", 1)) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" \u591A\u9009\u6A21\u5F0F\u4E14\u9009\u62E9\u4E86\u76EE\u6807\u5C55\u793A\u6B64 "),
            $data.selectedTargetInMoreChoseMode ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "p-1 rounded main-bg-color text-white",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.sendDataToUser && $options.sendDataToUser(...args))
            }, "\u53D1\u9001(" + vue.toDisplayString($data.selectedCount) + ")", 1)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
        }, 8, ["title"]),
        vue.createCommentVNode(" \u641C\u7D22\u6846\uFF08\u76D2\u5B50\u5360\u4F4D\uFF0C\u70B9\u51FB\u540E\u4E0A\u65B9\u5F00\u59CB\u641C\u7D22\u6846(\u8DDF\u7740\u906E\u7F69\u5C42)\uFF09 | \u6700\u8FD1\u8F6C\u53D1\u7684\u5BF9\u8C61(\u5982\u679C\u6700\u8FD1\u6CA1\u8F6C\u53D1\u5219\u4E0D\u663E\u793A) "),
        vue.createElementVNode("view", { class: "p-2" }, [
          vue.createElementVNode("view", {
            class: "py-2 rounded bg-white text-center text-common-font font-sm",
            onClick: _cache[4] || (_cache[4] = () => {
            })
          }, [
            vue.createCommentVNode(" \u5728\u591A\u9009\u65F6\uFF0C\u9009\u62E9\u7684\u7528\u6237\u4F1A\u6B64\u8FDB\u884C\u663E\u793A "),
            !$data.sendSingle ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "flex flex-wrap"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.selectedUserList, (user) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "m-2 rounded font-small text-common-font text-center text-ellipsis position-relative",
                  style: { "width": "50rpx" },
                  key: user.id
                }, [
                  vue.createElementVNode("image", {
                    src: user.image_src,
                    style: { "width": "100%", "height": "50rpx" }
                  }, null, 8, ["src"]),
                  vue.createCommentVNode(' <image src="/static/logo.png"></image> ')
                ]);
              }), 128))
            ])) : vue.createCommentVNode("v-if", true),
            vue.withDirectives(vue.createElementVNode("textarea", {
              "auto-height": "",
              maxlength: -1,
              onKeyup: _cache[2] || (_cache[2] = (...args) => $options.inputWatcher && $options.inputWatcher(...args)),
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.searchVal = $event),
              style: { "max-height": "75rpx", "max-width": "400rpx", "overflow": "auto", "margin": "auto" },
              placeholder: "\u{1F50D} \u641C\u7D22"
            }, null, 544), [
              [vue.vModelText, $data.searchVal]
            ])
          ]),
          vue.createCommentVNode(" \u6700\u8FD1\u8F6C\u53D1\u7684\u5BF9\u8C61\u7528\u6237\uFF0C\u5982\u679C\u6CA1\u6709\u8F6C\u53D1\u8FC7\u5219\u4E0D\u663E\u793A "),
          !$data.havingSearchUser ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "py-4"
          }, [
            vue.createElementVNode("view", { class: "font-small" }, "\u6700\u8FD1\u8F6C\u53D1"),
            vue.createCommentVNode(" \u8F6C\u53D1\u7684\u5BF9\u8C61 "),
            vue.createElementVNode("view", { class: "flex flex-wrap" }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.recentContact, (user) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "m-2 rounded font-small text-common-font text-center text-ellipsis position-relative",
                  style: { "width": "100rpx" },
                  onClick: ($event) => $options.sendToIt(user),
                  key: user.id
                }, [
                  vue.createCommentVNode("  \u5706\u5708\u9009\u62E9\u6846 "),
                  !$data.sendSingle ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "position-absolute zTop flex justify-center align-center rounded-circle border",
                    style: { "top": "5rpx", "right": "5rpx", "width": "30rpx", "height": "30rpx" }
                  }, [
                    vue.createCommentVNode(" \u9009\u4E2D\u65F6\u6B64\u6837\u5F0F\u663E\u793A "),
                    user.isSelected ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      style: { "height": "15rpx", "width": "15rpx" },
                      class: "main-bg-color rounded-circle"
                    })) : vue.createCommentVNode("v-if", true)
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("image", {
                    src: user.image_src,
                    style: { "width": "100%", "height": "100rpx" }
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "text-ellipsis" }, vue.toDisplayString(user.user_name), 1),
                  vue.createCommentVNode(' <image src="/static/logo.png"></image> ')
                ], 8, ["onClick"]);
              }), 128))
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createCommentVNode(" \u53EF\u5206\u4EAB\u7684\u5BF9\u8C61\u7528\u6237 "),
        !$data.havingSearchUser ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "bg-white"
        }, [
          vue.createElementVNode("view", { class: "flex p-2 font-small justify-between bg-common-shallow" }, [
            vue.createElementVNode("view", null, "\u6700\u8FD1\u804A\u5929"),
            vue.createElementVNode("view", { class: "main-text-color" }, "+ \u521B\u5EFA\u65B0\u7684\u804A\u5929")
          ]),
          vue.createCommentVNode(" \u7F6E\u9876\u5BF9\u8C61\u7528\u6237 "),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userTopList, (user) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              onClick: ($event) => $options.sendToIt(user),
              class: "bg-common-shallow",
              title: user.user_name,
              img: user.image_src,
              key: user.id
            }, {
              prefix: vue.withCtx(() => [
                !$data.sendSingle ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "pr-2"
                }, [
                  vue.createElementVNode("view", {
                    class: "zTop flex justify-center align-center rounded-circle border",
                    style: { "top": "5rpx", "right": "5rpx", "width": "30rpx", "height": "30rpx", "border-color": "black" }
                  }, [
                    vue.createCommentVNode(" \u9009\u4E2D\u65F6\u6B64\u6837\u5F0F\u663E\u793A "),
                    user.isSelected ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      style: { "height": "15rpx", "width": "15rpx" },
                      class: "main-bg-color rounded-circle"
                    })) : vue.createCommentVNode("v-if", true)
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 2
            }, 1032, ["onClick", "title", "img"]);
          }), 128)),
          vue.createCommentVNode(" \u975E\u7F6E\u9876\u5BF9\u8C61\u7528\u6237 "),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.userListOfNotTop, (user) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              onClick: ($event) => $options.sendToIt(user),
              title: user.user_name,
              img: user.image_src,
              key: user.id
            }, {
              prefix: vue.withCtx(() => [
                !$data.sendSingle ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "pr-2"
                }, [
                  vue.createElementVNode("view", {
                    class: "zTop flex justify-center align-center rounded-circle border",
                    style: { "top": "5rpx", "right": "5rpx", "width": "30rpx", "height": "30rpx", "border-color": "black" }
                  }, [
                    vue.createCommentVNode(" \u9009\u4E2D\u65F6\u6B64\u6837\u5F0F\u663E\u793A "),
                    user.isSelected ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      style: { "height": "15rpx", "width": "15rpx" },
                      class: "main-bg-color rounded-circle"
                    })) : vue.createCommentVNode("v-if", true)
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 2
            }, 1032, ["onClick", "title", "img"]);
          }), 128))
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" \u641C\u7D22\u7528\u6237\u65F6\u663E\u793A ,\u663E\u793A\u591A\u9009\u6846 "),
        $data.havingSearchUser ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
          vue.createCommentVNode(" \u8054\u7CFB\u4EBA \uFF0C\u663E\u793A\u6635\u79F0"),
          vue.createElementVNode("view", null, [
            vue.createElementVNode("view", { class: "font-small text-common-font m-2" }, "\u8054\u7CFB\u4EBA")
          ]),
          vue.createCommentVNode(" \u7FA4\u804A \uFF0C\u4E0D\u663E\u793A\u6635\u79F0"),
          vue.createElementVNode("view", { class: "font-small text-common-font m-2" }, "\u7FA4\u804A"),
          vue.createElementVNode("view"),
          vue.createTextVNode(" \u6B63\u5728\u641C\u7D22\u7528\u6237\uFF0C\u6709\u65F6\u95F4\u5728\u8FDB\u884C\u529F\u80FD\u5B8C\u5584\uFF0C\u6574\u4F53\u548C\u7528\u6237\u663E\u793A\u76F8\u540C ")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createVNode(_component_yx_popup, {
          show: $data.show,
          isCustom: true,
          onHide: $options.hidePopup,
          popPosittion: $data.popPosition
        }, {
          custom: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "p-2 mt-1" }, [
              vue.createElementVNode("view", { class: "m-1 font-weight-bold font-sm" }, "\u53D1\u9001\u7ED9\uFF1A"),
              vue.createCommentVNode(" \u53D1\u9001\u5BF9\u8C61\u7528\u6237\u5217\u8868 "),
              vue.createElementVNode("view", { class: "flex flex-wrap m-2" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.selectedUserList, (user) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: user.id,
                    class: "rounded overflow-hidden m-1",
                    style: { "width": "60rpx", "height": "60rpx" }
                  }, [
                    vue.createElementVNode("image", {
                      src: user.image_src,
                      style: { "width": "100%", "height": "100%" },
                      mode: "aspectFill"
                    }, null, 8, ["src"])
                  ]);
                }), 128))
              ]),
              vue.createElementVNode("view", { class: "ml-1 my-2 font-sm text-common-font" }, "[\u4E2A\u4EBA\u540D\u7247]\u8D85\u4EBA"),
              vue.createElementVNode("view", { class: "my-4 bg-common p-1" }, [
                vue.createElementVNode("textarea", {
                  "auto-height": "",
                  maxlength: -1,
                  style: { "max-height": "75rpx", "max-width": "400rpx", "overflow": "auto" },
                  placeholder: "\u7ED9\u670B\u53CB\u7559\u8A00"
                })
              ]),
              vue.createCommentVNode(" \u63D0\u4EA4\u6A21\u5757 "),
              vue.createElementVNode("view", { class: "font-sm pt-3 font-weight-bold flex text-center justify-center align-center" }, [
                vue.createElementVNode("view", {
                  style: { "border-right": "1px solid #ccc", "height": "50rpx", "line-height": "50rpx" },
                  class: "flex-1",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.hidePopup && $options.hidePopup(...args))
                }, "\u53D6\u6D88"),
                vue.createElementVNode("view", {
                  class: "main-text-color flex-1",
                  style: { "height": "50rpx", "line-height": "50rpx" },
                  onClick: _cache[6] || (_cache[6] = (...args) => $options.sendDataToUser && $options.sendDataToUser(...args))
                }, "\u53D1\u9001")
              ])
            ])
          ]),
          _: 1
        }, 8, ["show", "onHide", "popPosittion"])
      ]),
      _: 1
    });
  }
  const PagesUserInfoUserCustomSettingShareFriendShareFriend = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend.vue"]]);
  const _sfc_main$6 = {
    onLoad(query) {
    },
    components: {
      YxNavBar,
      YxList,
      YxFlexibleWrapper
    },
    mounted() {
      this.listData = [
        {
          id: Math.random() * 2e3,
          publish_time: "\u6628\u5929",
          img: "/static/logo.png",
          message: "\u6211\u53D1\u4E0D\u4E86\u4E00\u4E2A\u8BC4\u8BBA\uFF0C\u5FEB\u6765\u548C\u6211\u4E00\u8D77\u8BA8\u8BBA\u5427\uFF0C\u671F\u5F85\u4F60\u7684\u52A0\u5165"
        },
        {
          id: Math.random() * 2e3,
          publish_time: "\u4ECA\u5929",
          img: "/static/logo.png",
          message: "\u5929\u884C\u5065\uFF0C\u541B\u5B50\u4EE5\u81EA\u5F3A\u4E0D\u606F\u3002\u4EBA\u751F\u662F\u4E00\u573A\u52AA\u529B\uFF0C\u5C31\u7B97\u7ED3\u5C40\u662F\u4E00\u4E2A\u70E7\u7CCA\u7684\u82B1\u5377\u5B50\uFF0C\u4E5F\u4E0D\u8981\u61CA\u6094\u81EA\u5DF1\u66FE\u7ECF\u7684\u4E00\u756A\u70C8\u706B\u953B\u70BC\u3002\u4EBA\u751F\u98CE\u666F\u5728\u8DEF\u8FC7\uFF0C\u4E0D\u5728\u7ED3\u5C40"
        },
        {
          id: Math.random() * 2e3,
          publish_time: "16\u70B9",
          img: "/static/logo.png",
          message: "\u4EBA\u751F\u5C31\u662F\u8FD9\u6837\uFF0C\u5F97\u5931\u65E0\u5E38\uFF0C\u5E38\u5B58\u5B89\u9759\u4E4B\u5FC3\uFF0C\u5E38\u5B58\u5BBD\u5BB9\u4E4B\u5FC3\uFF0C\u5FC3\u91CC\u653E\u4E0D\u4E0B\uFF0C\u81EA\u7136\u5C31\u6210\u4E86\u8D1F\u62C5\uFF0C\u8D1F\u62C5\u8D8A\u591A\uFF0C\u4EBA\u751F\u5C31\u8D8A\u4E0D\u5FEB\u4E50\u3002\u4F18\u96C5\u7684\u4EBA\u751F\uFF0C\u5C31\u662F\u7528\u5E73\u9759\u7684\u5FC3\uFF0C\u5E73\u548C\u7684\u5FC3\u6001\uFF0C\u522B\u518D\u4E3A\u9519\u8FC7\u4E86\u4EC0\u4E48\u800C\u61CA\u6094\u3002"
        },
        {
          id: Math.random() * 2e3,
          publish_time: "\u524D\u5929",
          img: "/static/logo.png",
          message: "\u3010\u8282\u4FED\u683C\u8A00\u3011\uFF1A\u5929\u4E0B\u4E4B\u4E8B\uFF0C\u5E38\u6210\u4E8E\u52E4\u4FED\u800C\u8D25\u4E8E\u5962\u9761\u3002\u2014\u2014\u9646\u6E38 \u4EBA\u751F\u683C\u8A00 \u8EAB\u5916\u969C\u788D\u4E8B\u5C0F\uFF0C\u5FC3\u4E2D\u969C\u788D\u4E8B\u5927\u3002\u2014\u2014\u7231\u9ED8\u751F \u8D22\u5BCC\u4E0E\u80C6\u8BC6\u540C\u5728\u3002\u2014\u2014\u7EF4\u5409\u5C14\uFF08\u53E4\u7F57\u9A6C\u8BD7\u4EBA\uFF09\u5B9E\u529B\u7684\u6765\u6E90\u4E0D\u662F\u80DC\u5229\u3002\u552F\u6709\u594B\u6597\u624D\u80FD\u589E\u5F3A\u5B9E\u529B\u3002\u5F53\u4F60\u5386\u7ECF\u82E6\u96BE\u800C\u4E0D\u6C14\u9981\uFF0C\u90A3\u5C31\u662F..."
        }
      ];
      if (window) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:89", "\u6D4F\u89C8\u5668\u5C4F\u5E55", window == null ? void 0 : window.screen);
        this.screenInfo.width = window.screen.width;
        this.screenInfo.height = window.screen.height;
      } else if (plus) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:93", plus.device);
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:94", "\u624B\u673A\u8BBE\u5907\u4FE1\u606F", plus.screen);
        this.screenInfo.width = plus.screen.resolutionWidth;
        this.screenInfo.height = plus.screen.resolutionHeight;
      }
    },
    data() {
      return {
        targetId: "",
        expandBackground: false,
        listData: [],
        sliderStartY: 0,
        sliderHeight: 0,
        screenInfo: {
          width: "",
          height: ""
        }
      };
    },
    methods: {
      handleTouchStart(e) {
        this.sliderStartY = e.changedTouches[0].clientY;
      },
      handleTouchMove(e) {
        let y = e.changedTouches[0].clientY;
        let target2 = y - this.sliderStartY;
        let dest = target2 > 0 ? 100 / this.screenInfo.height * target2 : 0;
        dest = dest > 25 ? 25 + dest * 0.2 : dest;
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:133", "dest", dest);
        this.sliderHeight = dest;
      },
      handleTouchEnd(e) {
        this.expandBackground = this.sliderHeight > 25;
        if (this.expandBackground) {
          this.sliderHeight = 120;
        } else {
          this.sliderStartY = 0;
          this.sliderHeight = 0;
        }
      },
      handleObjEvent(data2) {
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:151", "data", data2);
        switch (data2.event) {
          case "tag":
            this.routerGo("/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag");
            break;
          case "auth":
            this.routerGo("/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth");
            break;
          case "recommend":
            this.routerGo("/pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend");
            break;
          default:
            formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:163", "\u65E0\u6CD5\u5904\u7406\u6B64\u914D\u7F6E");
            break;
        }
      },
      routerGo(path) {
        uni.navigateTo({
          url: path
        });
      }
    },
    computed: {
      sliderBgDistance() {
        const distance = -50 + this.sliderHeight;
        formatAppLog("log", "at pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue:182", "slider", this.sliderHeight);
        return distance > 0 ? 0 : distance;
      },
      commentCount() {
        return this.listData.length;
      },
      showList() {
        return this.listData.splice(0, 2);
      },
      sliderVh() {
        return 100 / this.screenInfo.height * target;
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      !$data.expandBackground ? (vue.openBlock(), vue.createBlock(_component_yx_nav_bar, {
        key: 0,
        title: "",
        existMore: false,
        isOpacity: true,
        requireOccupy: false
      })) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_yx_flexible_wrapper, null, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", {
            onTouchstart: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleTouchStart && $options.handleTouchStart(...args), ["stop"])),
            onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.handleTouchMove && $options.handleTouchMove(...args), ["stop"])),
            onTouchend: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args), ["stop"]))
          }, [
            vue.createCommentVNode(" \u4E3A\u4E86\u9002\u914D\u5C4F\u5E55\u800C\u5355\u4F4D\u9700\u8981\u7EDF\u4E00\uFF0C\u8FD9\u91CC\u4F7F\u7528vh\u4F5C\u4E3A\u5355\u4F4D\u5219\u4E0B\u9762\u7684\u5916\u8FB9\u8DDD\u4E5F\u8981\u4F7F\u7528vh\uFF08\u4E0D\u9002\u7528vh\u5219\u65E0\u6CD5\u8FBE\u5230\u9002\u914D\uFF09,\u4F7F\u7528device\u62FF\u5230\u5F53\u524D\u5C4F\u5E55\u7684\u4FE1\u606F\u6839\u636E\u79FB\u52A8\u8DDD\u79BB\u6362\u7B97\u51FAvw | vh "),
            vue.createCommentVNode(' <view class="position-absolute bg-common "   style="left:0;height:80vh;width:100vw" :style="`top:${sliderBgDistance}rpx`"> '),
            vue.createElementVNode("view", {
              class: "position-absolute bg-common",
              style: vue.normalizeStyle([{ "left": "0", "height": "80vh", "width": "100vw" }, `top:${$options.sliderBgDistance}vh`])
            }, [
              vue.createElementVNode("image", {
                src: "/static/images/friendCircleBg.png",
                style: { "width": "100%", "height": "100%" }
              }),
              vue.createElementVNode("view", { class: "zTop position-relative" }, [
                $data.expandBackground ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "position-absolute p-1 rounded-circle border font-sm text-white text-center",
                  style: { "right": "30rpx", "top": "-80rpx", "border-color": "white", "width": "80rpx" }
                }, "\u2764 \u8D5E")) : vue.createCommentVNode("v-if", true)
              ])
            ], 4),
            vue.createCommentVNode(" \u5C55\u793A\u7528\u6237\u56FE\u7247\u548C\u59D3\u540D "),
            vue.createCommentVNode(" \u4E0A\u9762\u5E03\u5C40\u4F7F\u7528\u4E86absolute\u8131\u79BB\u4E86\u6587\u6863\u6D41\uFF0C\u56E0\u6B64\u6211\u4EEC\u8FD9\u91CC\u7684\u76D2\u5B50\u4F1A\u51FA\u73B0\u5728\u7B2C\u4E00\u884C\uFF0C\u56E0\u6B64\u9700\u8981\u4F7F\u7528\u5916\u8FB9\u8DDD\u6765\u8FDB\u884C\u79FB\u52A8\u8FBE\u5230\u6B63\u786E\u7684\u4F4D\u7F6E "),
            vue.createCommentVNode(' <view class="flex  justify-end p-2 align-center " :style="`padding-top: ${350+sliderHeight}rpx;`"> '),
            vue.createElementVNode("view", {
              class: "flex justify-end p-2 align-center",
              style: vue.normalizeStyle(`padding-top: ${25 + $data.sliderHeight}vh;`)
            }, [
              vue.createElementVNode("view", { class: "mr-2 zTop text-common-font font-sm" }, "\u6211\u662Fmera"),
              vue.createElementVNode("view", {
                class: "rounded overflow-hidden",
                style: { "width": "100rpx", "height": "100rpx" }
              }, [
                vue.createElementVNode("image", {
                  src: "/static/logo.png",
                  style: { "width": "100%", "height": "100%" }
                })
              ])
            ], 4),
            vue.createCommentVNode(" \u5C55\u793A\u5177\u4F53\u4FE1\u606F "),
            vue.createElementVNode("view", { class: "mt-5 pt-5" }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.showList, (data2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "flex align-start p-2",
                  key: data2.id
                }, [
                  vue.createElementVNode("view", { class: "font-lg font-weight-bold" }, vue.toDisplayString(data2.publish_time), 1),
                  vue.createElementVNode("view", {
                    class: "rounded overflow-hidden mx-2",
                    style: { "width": "140rpx", "height": "140rpx" }
                  }, [
                    vue.createElementVNode("image", {
                      src: data2.img,
                      style: { "width": "100%", "height": "100%" }
                    }, null, 8, ["src"])
                  ]),
                  vue.createElementVNode("view", { class: "flex-1 text-overflow-line-2" }, vue.toDisplayString(data2.message), 1)
                ]);
              }), 128)),
              $options.commentCount > 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "font-sm text-common text-center"
              }, "\u70B9\u51FB\u67E5\u770B\u66F4\u591A\u4FE1\u606F >")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "p-5 font-small flex text-common align-center" }, [
              vue.createElementVNode("view", {
                class: "flex-1",
                style: { "border": "1rpx solid #ccc" }
              }),
              vue.createElementVNode("view", { class: "mx-2" }, "\u670B\u53CB\u4EC5\u5C55\u793A" + vue.toDisplayString("\u4E09\u5929") + "\u7684\u670B\u53CB\u5708"),
              vue.createElementVNode("view", {
                class: "flex-1",
                style: { "border": "1rpx solid #ccc" }
              })
            ])
          ], 32)
        ]),
        _: 1
      })
    ]);
  }
  const PagesUserInfoUserCustomSettingFriendCircleFriendCircle = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle.vue"]]);
  const friendDynamicList = [
    {
      id: Math.random() * 2e3,
      user_img: "/static/logo.png",
      user_name: "\u5149\u987E",
      content: "\u5F88\u8212\u670D\u554A",
      image_list: ["/static/images/bg.jpg", "/static/images/friendCircleBg.png"],
      publish_time: Date.now() - Math.floor(Math.random() * 1e4),
      like_list: ["001", "1"],
      reply_list: [
        {
          id: "1",
          name: "\u559C\u6B22",
          having_reply_obj: "",
          reply_content: "\u51FA\u53BB\u73A9\u554A"
        },
        {
          id: 2,
          name: "\u661F\u6674",
          having_reply_obj: "1",
          reply_content: "\u53EF\u4EE5\u554A\uFF0C\u6211\u627E\u4F60"
        }
      ]
    },
    {
      id: Math.random() * 2e3,
      user_img: "/static/logo1.png",
      user_name: "\u6B22\u8FCE",
      content: "\u671F\u5F85\u4F60\u7684\u52A0\u5165",
      image_list: ["/static/images/bg.jpg"],
      publish_time: Date.now() - Math.floor(Math.random() * 99999) * 1e3 * 60,
      like_list: ["001"],
      reply_list: []
    },
    {
      id: Math.random() * 2e3,
      user_img: "/static/logo.png",
      user_name: "\u4ECA\u5929\uFF0C\u6628\u5929\uFF0C\u660E\u5929",
      content: "\u5E0C\u671B\u672A\u6765\u53EF\u4EE5\u66F4\u597D",
      image_list: ["/static/images/friendCircleBg.png"],
      publish_time: Date.now() - Math.floor(Math.random() * 99999) * 1e3,
      like_list: ["001", "1"],
      reply_list: [
        {
          id: "1",
          name: "\u559C\u6B22",
          having_reply_obj: "",
          reply_content: "\u597D\u554A\uFF0C\u6211\u53EF\u4EE5"
        }
      ]
    },
    {
      id: Math.random() * 2e3,
      user_img: "/static/logo1.png",
      user_name: "\u671F\u521D",
      content: "\u8FD9\u662F\u6211\u7684\u7B2C\u4E00\u6761\u670B\u53CB\u5708\uFF0C\u8BF7\u591A\u5173\u7167",
      image_list: [],
      publish_time: Date.now() - Math.floor(Math.random() * 99999) * 1e5 * 60,
      like_list: [],
      reply_list: []
    },
    {
      id: Math.random() * 2e3,
      user_img: "/static/logo.png",
      user_name: "VvZ",
      content: "\u600E\u4E48\u6CA1\u4EBA\u627E\u6211\u73A9\uFF0C\u6211\u597D\u65E0\u804A",
      image_list: [],
      publish_time: Date.now() - Math.floor(Math.random() * 99999) * 1e3 * 60,
      like_list: [],
      reply_list: [
        {
          id: "1",
          name: "\u661F\u6674",
          having_reply_obj: "",
          reply_content: "\u6211\u53BB\u627E\u4F60\uFF0C\u4F60\u7B49\u6211"
        }
      ]
    }
  ];
  function publishTimeConvert(time) {
    let now2 = dayjs();
    let year = dayjs(now2).diff(time, "year");
    let month = dayjs(now2).diff(time, "month");
    let week = dayjs(now2).diff(time, "week");
    let hour = dayjs(now2).diff(time, "hour");
    let minute = dayjs(now2).diff(time, "minute");
    let second = dayjs(now2).diff(time, "second");
    if (year) {
      return year + "\u5E74\u524D";
    } else if (month) {
      return month + "\u6708\u524D";
    } else if (week) {
      return week + "\u661F\u671F\u524D";
    } else if (hour) {
      return hour + "\u5C0F\u65F6\u524D";
    } else if (minute) {
      return minute + "\u5206\u949F\u524D";
    } else if (second) {
      return second + "\u79D2\u524D";
    }
    return "\u4F20\u5165\u7684\u65F6\u95F4\u4E0D\u6B63\u786E";
  }
  const _sfc_main$5 = {
    components: { YxNavBar, YxFlexibleWrapper, YxCard },
    mounted() {
      this.friendDynamicList = this.friendDynamicList.map((dynamic) => {
        dynamic.expandComment = false;
        dynamic.isThumb = false;
        return dynamic;
      });
      if (uni.onKeyboardHeightChange) {
        uni.onKeyboardHeightChange((e) => {
          formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:107", "\u952E\u76D8\u9AD8\u5EA6\u6539\u53D8\u4E86", e);
          this.keyboardHeight = e;
        });
      }
    },
    data() {
      return {
        friendDynamicList,
        isComment: false,
        keyboardHeight: 0,
        replyObj: "",
        replyVal: "",
        replyDynamic: ""
      };
    },
    methods: {
      publishTimeConvert,
      previewImg(img) {
        uni.previewImage({
          current: img,
          urls: [img]
        });
      },
      toPublishDynamic() {
        uni.navigateTo({
          url: "/pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic"
        });
      },
      touchStart() {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:136", "\u5F00\u59CB\u89E6\u6478\u4E86");
        this.friendDynamicList.forEach((dynamic) => dynamic.expandComment = false);
        this.isComment = false;
        this.replyVal = "";
      },
      toggleComment(dynamic) {
        dynamic.expandComment = !dynamic.expandComment;
      },
      clickThumb(dynamic) {
        dynamic.isThumb = !dynamic.isThumb;
        if (dynamic.isThumb) {
          dynamic.like_list.push("me");
        } else {
          const index = dynamic.like_list.findIndex((like) => like == "me");
          dynamic.like_list.splice(index, 1);
        }
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:153", "\u70B9\u8D5E");
      },
      recordClickDynamic(dynamic) {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:156", "\u5192\u6CE1\u8BB0\u5F55\u5F53\u524D\u7528\u6237");
        this.replyDynamic = dynamic;
      },
      clickComment(reply_user) {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:160", "\u8BC4\u8BBA");
        this.isComment = true;
        if (reply_user) {
          this.replyObj = reply_user.name;
        } else {
          this.replyObj = "";
        }
      },
      publishReply() {
        this.replyDynamic.reply_list.push({
          id: "3",
          name: "me",
          having_reply_obj: this.replyObj,
          reply_content: this.replyVal
        });
        this.isComment = false;
        this.replyVal = "";
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:180", "\u53D1\u5E03\u56DE\u5E94");
      }
    },
    computed: {
      commentInputStyle() {
        let style = this.isComment ? "opacity:1;" : "opacity:0;";
        style += `bottom:${this.keyboardHeight ? this.keyboardHeight * 2 : 500}rpx`;
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue:188", "@style", style);
        return style;
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_card = vue.resolveComponent("yx-card");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_yx_nav_bar, {
        title: "",
        existMore: false,
        routerPath: `/pages/tabbar/find/find?${_ctx.name}`
      }, {
        suffix: vue.withCtx(() => [
          vue.createElementVNode("view", {
            class: "p-1 font-sm main-bg-color text-white rounded",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toPublishDynamic && $options.toPublishDynamic(...args))
          }, " \u53D1\u5E03 ")
        ]),
        _: 1
      }, 8, ["routerPath"]),
      vue.createVNode(_component_yx_flexible_wrapper, { height: "93vh" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", {
            onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.touchStart && $options.touchStart(...args))
          }, [
            vue.createCommentVNode(" \u9876\u90E8\u914D\u7F6E "),
            vue.createElementVNode("view", { style: { "height": "40vh" } }, [
              vue.createElementVNode("image", {
                src: "/static/images/friendCircleBg.png",
                mode: "aspectFill",
                style: { "height": "100%", "width": "100%" }
              })
            ]),
            vue.createElementVNode("view", {
              class: "position-relative",
              style: { "height": "150rpx" }
            }, [
              vue.createElementVNode("view", {
                class: "position-absolute",
                style: { "right": "20rpx", "top": "-80rpx" }
              }, [
                vue.createElementVNode("view", { class: "flex align-center justify-end font-md text-white" }, [
                  vue.createTextVNode(" Zz "),
                  vue.createElementVNode("view", {
                    class: "rounded overflow-hidden ml-2",
                    style: { "width": "120rpx", "height": "120rpx" }
                  }, [
                    vue.createElementVNode("image", {
                      src: "/static/logo.png",
                      mode: "aspectFill",
                      style: { "width": "100%", "height": "100%" }
                    })
                  ])
                ])
              ])
            ]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.friendDynamicList, (dynamic) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "mt-2 p-1",
                style: { "border-bottom": "1rpx solid #ccc" },
                onClick: ($event) => $options.recordClickDynamic(dynamic),
                key: dynamic.id
              }, [
                vue.createVNode(_component_yx_card, {
                  img: dynamic.user_img,
                  isCover: false
                }, {
                  desc: vue.withCtx(() => [
                    vue.createCommentVNode(" \u5185\u5BB9\u8FB9\u8DDD "),
                    vue.createElementVNode("view", { class: "pr-2" }, [
                      vue.createElementVNode("view", { class: "dynamic-common-color font-md mb-1" }, vue.toDisplayString(dynamic.user_name), 1),
                      vue.createElementVNode("view", { class: "mb-1 font-md text-dark" }, vue.toDisplayString(dynamic.content), 1),
                      vue.createCommentVNode(" \u52A8\u6001\u56FE\u7247 "),
                      dynamic.image_list.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "mb-2 flex flex-wrap"
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(dynamic.image_list, (img, i2) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "size-2 m-1 flex-1",
                            onClick: ($event) => $options.previewImg(img),
                            key: i2
                          }, [
                            vue.createElementVNode("image", {
                              src: img,
                              mode: "aspectFit",
                              class: "el-full"
                            }, null, 8, ["src"])
                          ], 8, ["onClick"]);
                        }), 128))
                      ])) : vue.createCommentVNode("v-if", true),
                      vue.createCommentVNode(" \u53D1\u5E03\u65F6\u95F4-\u70B9\u8D5E "),
                      vue.createElementVNode("view", { class: "m-2 flex justify-between align-center position-relative" }, [
                        vue.createCommentVNode(" <view>{{dynamic.publish_time}}</view> "),
                        vue.createElementVNode("view", null, vue.toDisplayString($options.publishTimeConvert(dynamic.publish_time)), 1),
                        vue.createElementVNode("view", {
                          class: "bg-common p-1",
                          onClick: ($event) => $options.toggleComment(dynamic)
                        }, [
                          vue.createElementVNode("text", { class: "font-sm" }, "\u66F4\u591A")
                        ], 8, ["onClick"]),
                        vue.createCommentVNode("  \u4F38\u5C55\u7684\u9009\u9879 "),
                        vue.createElementVNode("view", {
                          class: "position-absolute grid grid-2 bg-dark grid-center-by-el transition-ease-fast",
                          style: vue.normalizeStyle([{ "right": "80rpx", "top": "0", "grid-auto-rows": "60rpx", "width": "300rpx" }, dynamic.expandComment ? "opacity:1" : "opacity:0"])
                        }, [
                          vue.createElementVNode("view", {
                            onClick: ($event) => $options.clickThumb(dynamic)
                          }, vue.toDisplayString(dynamic.isThumb ? "\u53D6\u6D88\u70B9\u8D5E" : "\u8D5E"), 9, ["onClick"]),
                          vue.createElementVNode("view", {
                            onClick: _cache[1] || (_cache[1] = ($event) => $options.clickComment())
                          }, "\u8BC4\u8BBA")
                        ], 4)
                      ]),
                      dynamic.like_list.length > 0 || dynamic.reply_list.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "bg-common p-1"
                      }, [
                        vue.createCommentVNode(" like\u5217\u8868 "),
                        dynamic.like_list.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "flex flex-wrap dynamic-common-color font-sm mb-1"
                        }, [
                          vue.createElementVNode("text", {
                            class: "iconfont icon-aixin-xian mr-1",
                            style: { "margin-top": "3rpx" }
                          }),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(dynamic.like_list, (like_id, i2) => {
                            return vue.openBlock(), vue.createElementBlock("view", { key: like_id }, vue.toDisplayString(like_id) + " " + vue.toDisplayString(i2 != dynamic.like_list.length - 1 ? "," : ""), 1);
                          }), 128))
                        ])) : vue.createCommentVNode("v-if", true),
                        vue.createCommentVNode(" \u8BC4\u8BBA\u5BF9\u8BDD\u5BF9\u5217\u8868 "),
                        dynamic.reply_list.length > 0 ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(dynamic.reply_list, (reply_user) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "flex flex-wrap font-sm mb-1",
                            onClick: ($event) => $options.clickComment(reply_user),
                            key: reply_user.id
                          }, [
                            vue.createElementVNode("view", { class: "dynamic-common-color" }, [
                              vue.createTextVNode(vue.toDisplayString(reply_user.name) + " ", 1),
                              reply_user.having_reply_obj ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, [
                                vue.createElementVNode("text", { class: "text-dark" }, "\u56DE\u590D"),
                                vue.createTextVNode(" " + vue.toDisplayString(reply_user.having_reply_obj), 1)
                              ])) : vue.createCommentVNode("v-if", true),
                              vue.createTextVNode(" : ")
                            ]),
                            vue.createElementVNode("view", { class: "text-dark ml-1" }, vue.toDisplayString(reply_user.reply_content), 1)
                          ], 8, ["onClick"]);
                        }), 128)) : vue.createCommentVNode("v-if", true)
                      ])) : vue.createCommentVNode("v-if", true)
                    ])
                  ]),
                  _: 2
                }, 1032, ["img"])
              ], 8, ["onClick"]);
            }), 128))
          ], 32),
          vue.createCommentVNode(" \u56DE\u590D\u8BC4\u8BBA\u65F6\u8C03\u7528 "),
          vue.createElementVNode("view", {
            class: "position-fixed flex align-center justify-center",
            style: vue.normalizeStyle([{ "width": "100%" }, $options.commentInputStyle])
          }, [
            vue.withDirectives(vue.createElementVNode("textarea", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.replyVal = $event),
              class: "bg-common p-1 flex-1",
              focus: $data.isComment,
              style: { "max-height": "100rpx" },
              maxlength: -1,
              placeholder: $data.replyObj ? `\u56DE\u590D${$data.replyObj}` : ""
            }, null, 8, ["focus", "placeholder"]), [
              [vue.vModelText, $data.replyVal]
            ]),
            vue.createElementVNode("view", {
              onClick: _cache[4] || (_cache[4] = (...args) => $options.publishReply && $options.publishReply(...args)),
              class: "p-1 font-sm main-bg-color text-white rounded text-center",
              style: { "height": "100rpx", "width": "100rpx", "line-height": "100rpx" }
            }, "\u786E\u8BA4")
          ], 4)
        ]),
        _: 1
      })
    ]);
  }
  const PagesTabbarFindFriendCIrcleFriendCIrcle = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/find/FriendCIrcle/FriendCIrcle.vue"]]);
  const _sfc_main$4 = {
    name: "yx-picture-select",
    inject: ["setShow", "getPicture"],
    props: {
      show: {
        type: Boolean
      },
      maxSelecPic: {
        type: [Number, String],
        default: "Infinity"
      }
    },
    components: {
      YxPopup
    },
    mounted() {
      formatAppLog("log", "at components/yx-picture-select.vue:33", this);
    },
    data() {
      return {};
    },
    methods: {
      getSrcFromAlbum() {
        formatAppLog("log", "at components/yx-picture-select.vue:41", "\u76F8\u518C");
        plus.gallery.pick(({ files }) => {
          files.forEach((path) => {
            formatAppLog("log", "at components/yx-picture-select.vue:45", "path", path);
            this.getPicture(path);
          });
        }, (err) => {
          formatAppLog("log", "at components/yx-picture-select.vue:50", err);
        }, {
          multiple: true,
          permissionAlert: true,
          filter: "none",
          maximum: this.maxSelecPic
        });
        this.setShow(false);
      },
      cameraAction() {
        formatAppLog("log", "at components/yx-picture-select.vue:61", "\u5F00\u59CB\u62CD\u7167");
        const camera = plus.camera.getCamera();
        camera.captureImage((path) => {
          plus.gallery.save(path, (path2) => {
            formatAppLog("log", "at components/yx-picture-select.vue:67", "@success", path2);
            this.getPicture(path2);
          });
        }, (err) => {
          formatAppLog("log", "at components/yx-picture-select.vue:73", err);
        });
        this.setShow(false);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_YxPopup = vue.resolveComponent("YxPopup");
    return vue.openBlock(), vue.createBlock(_component_YxPopup, {
      isBottom: "",
      show: $props.show,
      onHide: _cache[3] || (_cache[3] = ($event) => $options.setShow(false)),
      popPosittion: { x: 0, y: 0 }
    }, {
      custom: vue.withCtx(() => [
        vue.createElementVNode("view", {
          class: "grid grid-center-by-grid-and-ele main-bg-color text-white rounded font-md",
          style: { "grid-auto-rows": "100rpx" }
        }, [
          vue.createElementVNode("view", {
            onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.cameraAction && $options.cameraAction(...args), ["stop"]))
          }, "\u62CD\u6444"),
          vue.createElementVNode("view", {
            onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.getSrcFromAlbum && $options.getSrcFromAlbum(...args), ["stop"])),
            class: "zTop"
          }, "\u4ECE\u76F8\u518C\u9009\u62E9"),
          vue.createCommentVNode(' <view style="height: 10rpx;width:100vw" class="bg-white"></view> '),
          vue.createElementVNode("view", {
            style: { "border-top": "10rpx solid white", "width": "100vw" },
            class: "text-center py-2",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.setShow(false))
          }, "\u53D6\u6D88")
        ])
      ]),
      _: 1
    }, 8, ["show"]);
  }
  const YxPictureSelect = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-picture-select.vue"]]);
  const _sfc_main$3 = {
    components: {
      YxNavBar,
      YxFlexibleWrapper,
      YxPopup,
      YxPictureSelect
    },
    provide() {
      return {
        setShow: this.setPopShow,
        getPicture: this.getPictureFromDevice
      };
    },
    mounted() {
    },
    data() {
      return {
        friendDynamicList,
        content: "",
        srcList: [],
        show: false,
        utilCloseTimer: null
      };
    },
    methods: {
      setPopShow(flag) {
        this.show = flag;
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:79", "show", this.show);
      },
      showUtilOfImg(img) {
        this.srcList.forEach((srcObj) => {
          srcObj.showUtil = srcObj.src == img;
        });
        if (this.utilCloseTimer)
          clearTimeout(this.utilCloseTimer);
        this.utilCloseTimer = setTimeout(() => {
          this.srcList.forEach((srcObj) => {
            srcObj.showUtil = false;
          });
        }, 3e3);
      },
      previewRes(img) {
        uni.previewImage({
          current: img,
          urls: [img]
        });
      },
      delRes(img) {
        const self2 = this;
        uni.showModal({
          title: "\u5220\u9664\u56FE\u7247",
          content: "\u4F60\u786E\u5B9A\u8981\u79FB\u9664\u8BE5\u56FE\u7247\u5417?",
          success(res) {
            if (res.confirm) {
              const index = self2.srcList.findIndex((srcObj) => srcObj.src == img);
              self2.srcList.splice(index, 1);
            }
          }
        });
      },
      publishDynamic() {
        if (this.content) {
          const publishDynmaicObj = {
            id: Math.random() * 2e3,
            user_img: "/static/logo.png",
            user_name: "me",
            content: this.content,
            image_list: this.srcList.map((srcObj) => srcObj.src),
            publish_time: Date.now(),
            like_list: [],
            reply_list: []
          };
          this.friendDynamicList.unshift(publishDynmaicObj);
          this.content = "";
          this.srcList = [];
          uni.navigateTo({
            url: "/pages/tabbar/find/FriendCIrcle/FriendCIrcle"
          });
        }
      },
      addImage() {
        this.show = true;
      },
      getPictureFromDevice(path) {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:140", "@ddd-p", path);
        this.srcList.push({ src: path, showUtil: false });
      },
      getSrcFromAlbum() {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:144", "\u76F8\u518C");
        const self2 = this;
        plus.gallery.pick(({ files }) => {
          files.forEach((path) => {
            self2.srcList.push({ src: path, showUtil: false });
          });
        }, (err) => {
          formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:151", err);
        }, {
          multiple: true,
          permissionAlert: true,
          filter: "none"
        });
        this.show = false;
      },
      cameraAction() {
        formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:161", "\u5F00\u59CB\u62CD\u7167");
        const camera = plus.camera.getCamera();
        const self2 = this;
        camera.captureImage((path) => {
          plus.gallery.save(path, (path2) => {
            formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:167", "@success", path2);
            self2.srcList.push({ src: path2.file, showUtil: false });
          });
        }, (err) => {
          formatAppLog("log", "at pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue:171", err);
        });
        this.show = false;
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_YxPictureSelect = vue.resolveComponent("YxPictureSelect");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createVNode(_component_yx_nav_bar, {
        title: "",
        existMore: false,
        routerPath: `/pages/tabbar/find/FriendCIrcle/FriendCIrcle?${_ctx.name}`
      }, {
        suffix: vue.withCtx(() => [
          vue.createElementVNode("view", {
            class: "p-1 font-sm main-bg-color text-white rounded",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.publishDynamic && $options.publishDynamic(...args))
          }, " \u53D1\u5E03 ")
        ]),
        _: 1
      }, 8, ["routerPath"]),
      vue.createVNode(_component_yx_flexible_wrapper, null, {
        default: vue.withCtx(() => [
          vue.createCommentVNode(' <view class="p-3" @click="clearImgUtilState"> '),
          vue.createElementVNode("view", { class: "p-3" }, [
            vue.createCommentVNode(' <view class="bg-common el-full"> '),
            vue.createCommentVNode(" \u5728\u6587\u672C\u57DF\u6ED1\u52A8\u65F6\u7981\u6B62\uFF08\u56E0\u89E6\u5E95\u6216\u89E6\u9876\uFF09\u4EA7\u751F\u4E8B\u4EF6\u5192\u6CE1\u4EA7\u751F\u7684\u5168\u5C40\u6ED1\u52A8 "),
            vue.withDirectives(vue.createElementVNode("textarea", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.content = $event),
              class: "zTop",
              onTouchstart: _cache[2] || (_cache[2] = vue.withModifiers(() => {
              }, ["stop"])),
              onTouchmove: _cache[3] || (_cache[3] = vue.withModifiers(() => {
              }, ["stop"])),
              onTouchend: _cache[4] || (_cache[4] = vue.withModifiers(() => {
              }, ["stop"])),
              focus: true,
              style: { "max-height": "200rpx", "width": "100%" },
              maxlength: -1,
              placeholder: "\u5206\u4EAB\u8FD9\u4E00\u523B\u7684\u611F\u60F3..."
            }, null, 544), [
              [vue.vModelText, $data.content]
            ]),
            vue.createCommentVNode(" \u53EF\u6DFB\u52A0\u56FE\u7247\u8FDB\u884C\u63CF\u8FF0 "),
            vue.createElementVNode("view", { class: "flex my-3 flex-wrap" }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.srcList, (imgOBj, i2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "size-2 rounded bg-common overflow-hidden mr-1 mb-1 position-relative",
                  onClick: ($event) => $options.showUtilOfImg(imgOBj.src),
                  key: i2
                }, [
                  vue.createElementVNode("image", {
                    src: imgOBj.src,
                    class: "el-full"
                  }, null, 8, ["src"]),
                  vue.createCommentVNode(" \u56FE\u7247\u906E\u7F69\u5C42\uFF0C\u7528\u4E8E\u9009\u62E9\u662F\u5220\u9664\u8FD8\u662F\u9884\u89C8\u56FE\u7247 "),
                  vue.createCommentVNode(` <view :style="imgOBj.showUtil ? 'display:block':'display:none'" class="el-full bg-dark lucency-5 zTop position-absolute grid-2 grid-center-by-el" style="left:0;top:0"> `),
                  vue.createElementVNode("view", {
                    style: vue.normalizeStyle([imgOBj.showUtil ? "display:block" : "display:none", { "left": "0", "top": "0" }]),
                    class: "el-full bg-dark lucency-5 zTop position-absolute"
                  }, [
                    vue.createElementVNode("view", {
                      class: "text-center",
                      style: { "line-height": "200rpx" }
                    }, [
                      vue.createElementVNode("text", {
                        class: "iconfont icon-preview text-white font-lg mr-1",
                        onClick: vue.withModifiers(($event) => $options.previewRes(imgOBj.src), ["stop"])
                      }, null, 8, ["onClick"]),
                      vue.createElementVNode("text", {
                        class: "iconfont icon-ashbin text-white font-lg ml-1",
                        onClick: vue.withModifiers(($event) => $options.delRes(imgOBj.src), ["stop"])
                      }, null, 8, ["onClick"])
                    ])
                  ], 4)
                ], 8, ["onClick"]);
              }), 128)),
              vue.createElementVNode("view", {
                class: "size-2 rounded bg-common font-lg grid grid-center-by-grid-and-ele",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.addImage && $options.addImage(...args))
              }, " + ")
            ]),
            vue.createCommentVNode(" </view> ")
          ]),
          vue.createCommentVNode(' 	<YxPopup isBottom :show="show" @hide="show = false" :popPosittion="{x:0,y:0}">\n			<template #custom>\n				<view class="grid  grid-center-by-grid-and-ele main-bg-color text-white rounded font-md" style="grid-auto-rows: 100rpx;">\n					<view @click.stop="cameraAction">\u62CD\u6444</view>\n					<view @click.stop="getSrcFromAlbum" class="zTop">\u4ECE\u76F8\u518C\u9009\u62E9</view>\n					<view style="border-top: 10rpx solid white;width:100vw;"  class=" text-center py-2" @click="show=false">\u53D6\u6D88</view>\n				</view>\n			</template>\n		</YxPopup> '),
          vue.createVNode(_component_YxPictureSelect, { show: $data.show }, null, 8, ["show"])
        ]),
        _: 1
      })
    ], 64);
  }
  const PagesTabbarFindFriendCIrclePublishDynamicPublishDynamic = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic.vue"]]);
  const _sfc_main$2 = {
    name: "yx-dialog",
    emits: ["hide"],
    props: ["show"],
    data() {
      return {};
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: "position-absolute fill-screen rounded bg-dark zTop",
        style: vue.normalizeStyle([$props.show ? "display:block" : "display:none", { "left": "50%", "top": "20%", "transform": "translate(-50%,-50%)", "width": "80vw", "height": "40vh" }])
      }, [
        vue.renderSlot(_ctx.$slots, "custom")
      ], 4),
      vue.createCommentVNode(" \u70B9\u51FB\u53D6\u6D88 "),
      vue.createElementVNode("view", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("hide")),
        style: vue.normalizeStyle([$props.show ? "display:block" : "display:none", { "left": "0", "top": "0" }]),
        class: "fill-screen position-absolute"
      }, null, 4)
    ], 64);
  }
  const YxDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/aLearning/project/uniapp-chat-project/components/yx-dialog.vue"]]);
  const _sfc_main$1 = {
    components: {
      YxNavBar,
      YxFlexibleWrapper,
      YxList,
      YxPictureSelect,
      YxDialog
    },
    provide() {
      return {
        setShow: this.setShow,
        getPicture: this.getPicture
      };
    },
    mounted() {
      this.list = [
        {
          id: this.avatarId,
          title: "\u5934\u50CF",
          suffix: "image",
          data: this.avatar,
          event: "avatar"
        },
        {
          id: this.nameId,
          title: "\u540D\u5B57",
          suffix: "text",
          data: this.name,
          event: "name"
        },
        {
          id: Math.random() * 2e3,
          title: "\u5FAE\u4FE1\u53F7",
          suffix: "text",
          data: "my_123"
        },
        {
          id: Math.random() * 2e3,
          title: "\u4E8C\u7EF4\u7801\u540D\u7247",
          suffix: "QRcode"
        }
      ];
    },
    data() {
      return {
        list: [],
        show: false,
        avatar: "/static/logo.png",
        avatarId: Math.random() * 2e3,
        name: "Zz",
        nameId: Math.random() * 2e3,
        dialogShow: true
      };
    },
    methods: {
      setShow(flag) {
        formatAppLog("log", "at pages/tabbar/user/UserInfo/UserInfo.vue:98", "\u6539\u53D8\u72B6\u6001\u4E3A");
        this.show = flag;
      },
      rename() {
        const self2 = this;
        const target2 = this.list.find((obj) => obj.id == self2.nameId);
        target2.data = this.name;
      },
      getPicture(path) {
        formatAppLog("log", "at pages/tabbar/user/UserInfo/UserInfo.vue:107", "\u8BBE\u7F6E\u56FE\u7247\u4E3A");
        this.avatar = path;
        formatAppLog("log", "at pages/tabbar/user/UserInfo/UserInfo.vue:109", "avat", this.avatar);
      },
      handleClick(data2) {
        switch (data2.event) {
          case "avatar":
            this.setShow(true);
            break;
          case "name":
            this.dialogShow = true;
        }
        if (data2.suffix != "image")
          return;
      }
    },
    watch: {
      avatar() {
        const self2 = this;
        const target2 = this.list.find((obj) => obj.id == self2.avatarId);
        target2.data = this.avatar;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_YxPictureSelect = vue.resolveComponent("YxPictureSelect");
    const _component_YxDialog = vue.resolveComponent("YxDialog");
    const _component_yx_flexible_wrapper = vue.resolveComponent("yx-flexible-wrapper");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createVNode(_component_yx_nav_bar, {
        title: "\u4E2A\u4EBA\u4FE1\u606F",
        existMore: false,
        routerPath: `/pages/tabbar/user/user?${$data.name}`
      }, null, 8, ["routerPath"]),
      vue.createVNode(_component_yx_flexible_wrapper, null, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.list, (t) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              key: t.id,
              title: t.title,
              isCell: "",
              onClick: ($event) => $options.handleClick(t)
            }, {
              suffix: vue.withCtx(() => [
                t.suffix == "image" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                  vue.createElementVNode("image", {
                    src: t.data,
                    class: "size-1"
                  }, null, 8, ["src"])
                ])) : vue.createCommentVNode("v-if", true),
                t.suffix == "text" ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, vue.toDisplayString(t.data), 1)) : vue.createCommentVNode("v-if", true),
                t.suffix == "QRcode" ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                  vue.createElementVNode("text", { class: "icon-qrcode iconfont" })
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 2
            }, 1032, ["title", "onClick"]);
          }), 128)),
          vue.createVNode(_component_YxPictureSelect, {
            maxSelecPic: 1,
            show: $data.show
          }, null, 8, ["show"]),
          vue.createVNode(_component_YxDialog, {
            show: $data.dialogShow,
            onHide: _cache[3] || (_cache[3] = ($event) => $data.dialogShow = false)
          }, {
            custom: vue.withCtx(() => [
              vue.createCommentVNode(' <view class="position-relative p-3 font-md text-white  el-full overflow-hidden"> '),
              vue.createElementVNode("view", { class: "position-relative p-3 text-white" }, [
                vue.createElementVNode("view", { class: "text-center" }, "\u8BBE\u7F6E\u6635\u79F0"),
                vue.createCommentVNode(' <textarea maxlength="15" class="bg-white" style="margin-top: 100rpx;"\r\n						 v-model="name" auto-height placeholder="\u8F93\u5165\u4F60\u559C\u6B22\u7684\u6635\u79F0\u5427"></textarea> '),
                vue.withDirectives(vue.createElementVNode("textarea", {
                  maxlength: "15",
                  class: "bg-white main-text-color p-2 ml-5",
                  "auto-focus": "",
                  "auto-height": "",
                  style: { "margin-top": "100rpx", "min-height": "40rpx", "width": "400rpx" },
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.name = $event),
                  placeholder: "\u8F93\u5165\u4F60\u559C\u6B22\u7684\u6635\u79F0\u5427"
                }, null, 512), [
                  [vue.vModelText, $data.name]
                ]),
                vue.createElementVNode("view", {
                  class: "grid grid-2 grid-center-by-el",
                  style: { "margin-top": "16vh" }
                }, [
                  vue.createElementVNode("view", {
                    onClick: _cache[1] || (_cache[1] = ($event) => $options.setShow(false))
                  }, "\u53D6\u6D88"),
                  vue.createElementVNode("view", {
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.rename && $options.rename(...args))
                  }, "\u786E\u8BA4")
                ])
              ])
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      })
    ], 64);
  }
  const PagesTabbarUserUserInfoUserInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/aLearning/project/uniapp-chat-project/pages/tabbar/user/UserInfo/UserInfo.vue"]]);
  __definePage("pages/tabbar/chat/chat", PagesTabbarChatChat);
  __definePage("pages/tabbar/find/find", PagesTabbarFindFind);
  __definePage("pages/tabbar/user/user", PagesTabbarUserUser);
  __definePage("pages/tabbar/friend/friend", PagesTabbarFriendFriend);
  __definePage("pages/chat-detail/chat-detail", PagesChatDetailChatDetail);
  __definePage("pages/chat-detail/chat-about-group-setting/chat-about-group-setting", PagesChatDetailChatAboutGroupSettingChatAboutGroupSetting);
  __definePage("pages/UserInfo/UserInfo", PagesUserInfoUserInfo);
  __definePage("pages/UserInfo/UserCustomSetting/UserCustomSetting", PagesUserInfoUserCustomSettingUserCustomSetting);
  __definePage("pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag", PagesUserInfoUserCustomSettingSetUserTagSetUserTag);
  __definePage("pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick", PagesUserInfoUserCustomSettingSetUserTagTagPickTagPick);
  __definePage("pages/UserInfo/UserCustomSetting/UserAuth/UserAuth", PagesUserInfoUserCustomSettingUserAuthUserAuth);
  __definePage("pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend", PagesUserInfoUserCustomSettingShareFriendShareFriend);
  __definePage("pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle", PagesUserInfoUserCustomSettingFriendCircleFriendCircle);
  __definePage("pages/tabbar/find/FriendCIrcle/FriendCIrcle", PagesTabbarFindFriendCIrcleFriendCIrcle);
  __definePage("pages/tabbar/find/FriendCIrcle/PublishDynamic/PublishDynamic", PagesTabbarFindFriendCIrclePublishDynamicPublishDynamic);
  __definePage("pages/tabbar/user/UserInfo/UserInfo", PagesTabbarUserUserInfoUserInfo);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:6", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:9", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:12", "App Hide");
    },
    mounted() {
      const { statusBarHeight, brand } = uni.getSystemInfoSync();
      this.statusBarHeight = statusBarHeight;
      if (brand) {
        this.device = "android";
      }
      formatAppLog("log", "at App.vue:26", "device", uni.getSystemInfoSync());
    },
    computed: {
      ...mapWritableState(useDeviceStore, ["statusBarHeight"]),
      ...mapWritableState(useDeviceStore, ["device"])
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/aLearning/project/uniapp-chat-project/App.vue"]]);
  const pinia = createPinia();
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(pinia);
    formatAppLog("log", "at main.js:22", "@app", app);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
