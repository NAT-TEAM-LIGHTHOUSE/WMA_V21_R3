export interface EngineContext {
  event: any;
  component: any;
}

export interface ParsedInstruction {
  type: 'call' | 'sequence' | 'raise' | 'literal';
  name?: string;
  args?: ParsedValue[];
  steps?: ParsedInstruction[];
  value?: any;
}

export type ParsedValue =
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'null'; value: null }
  | { kind: 'identifier'; value: string }
  | { kind: 'sysvar'; value: string }
  | { kind: 'call'; value: ParsedInstruction }
  | { kind: 'array'; value: ParsedValue[] }
  | { kind: 'object'; value: Record<string, ParsedValue> };

export interface FunctionConfig {
  target: string;
  prependEvent?: boolean;
  defaultArgs?: ((ctx: EngineContext) => any[]) | any[];
  awaitResult?: boolean;
}

export class DynamicEventEngine {
  private readonly functionMap: Record<string, FunctionConfig> = {
    get_current_record: { target: 'lhs_lib.get_frame_record', prependEvent: true },
    get_item_value: { target: 'lhs_lib.get_item_value' },
    is_record_present: { target: 'lhs_lib.is_record_present', awaitResult: true },

    set_lwsdp: { target: 'set_lwsdp' },
    remove_lwsdp: { target: 'remove_lwsdp' },
    plsql_to_js: { target: 'plsql_to_js', prependEvent: true },
    clear_lwsdp: { target: 'clear_lwsdp' },

    app_backup_frame: { target: 'app_backup_frame' },
    app_restore_frame: { target: 'app_restore_frame' },
    copy_json: { target: 'copy_json' },

    app_open_advance_filter: { target: 'app_open_advance_filter', prependEvent: true },
    app_close_tab: { target: 'app_close_tab', prependEvent: true },

    ws_open_url: { target: 'ws_open_url', prependEvent: true },
    ws_call_url: { target: 'ws_call_url', prependEvent: true, awaitResult: true },
    ws_call_api: { target: 'ws_call_api', prependEvent: true },

    app_execute_api: {
      target: 'getData',
      prependEvent: true,
      defaultArgs: ['app_execute_api'],
      awaitResult: true,
    },

    app_show_frame: { target: 'app_show_frame', awaitResult: true },

    app_execute_batch: {
      target: 'getData',
      prependEvent: true,
      defaultArgs: ['execute_batch'],
      awaitResult: true,
    },
    app_gsp_service: {
      target: 'getData',
      prependEvent: true,
      defaultArgs: ['gsp_service'],
      awaitResult: true,
    },
    
    get_item_search: { target: 'lhs_lib.get_item_search' },
    set_item_search: { target: 'set_item_search', prependEvent: true },
    set_dp_for_cb: { target: 'set_dp_for_cb' },

    server_host: { target: 'server_host' },
    timer: { target: 'timer', prependEvent: true },
    stop_timer: { target: 'stop_timer' },

    app_itemclicked: { target: 'app_itemClicked' },

    local_host: { target: 'localHostMethod', prependEvent: true, awaitResult: true },

    set_item_value: { target: 'lhs_lib.set_item_value', prependEvent: true },
    app_reload_frame: { target: 'app_reload_frame', prependEvent: true },
    populate_list: { target: 'populate_list', prependEvent: true },
    populate_list_force: { target: 'populate_list_force', prependEvent: true },

    set_row_values: { target: 'lhs_lib.set_row_values' },
    get_row_values: { target: 'lhs_lib.get_row_values' },

    app_back_object: { target: 'app_back_object', prependEvent: true },
    app_clear_record: { target: 'app_clear_record', prependEvent: true },

    async_a: { target: 'async_a', prependEvent: true },
    async_s: { target: 'async_s', prependEvent: true, awaitResult: true },

    app_required_item: { target: 'app_required_item' },
    app_required_record: { target: 'app_required_record', prependEvent: true, awaitResult: true },
    app_required_frame: { target: 'app_required_frame', prependEvent: true, awaitResult: true },

    app_copy_record: { target: 'lhs_lib.app_copy_record', prependEvent: true, awaitResult: true },
    app_paste_record: { target: 'lhs_lib.app_paste_record', prependEvent: true, awaitResult: true },

    app_back_page: { target: 'app_back_page', prependEvent: true },

    stop_time: { target: 'stop_timer' },

    app_copy_frame: { target: 'lhs_lib.app_copy_frame' },
    execute_json: { target: 'execute_json' },
    app_paste_frame: { target: 'app_paste_frame', prependEvent: true },

    get_item_config: { target: 'lhs_lib.get_item_config' },
    get_item: { target: 'lhs_lib.get_item' },
    set_item_config: { target: 'lhs_lib.set_item_config' },
    set_visible_flag: { target: 'lhs_lib.set_visible_flag' },
    set_enable_flag: { target: 'lhs_lib.set_enable_flag' },
    set_matrix_item_config: { target: 'lhs_lib.set_matrix_item_config' },
    set_rows_source_config: { target: 'lhs_lib.set_rows_source_config' },

    get_frame_config: { target: 'lhs_lib.get_frame_config' },
    set_frame_config: { target: 'lhs_lib.set_frame_config' },
    get_page_config: { target: 'lhs_lib.get_page_config' },
    set_page_config: { target: 'lhs_lib.set_page_config' },

    sum: { target: 'lhs_lib.sum', awaitResult: true },
    count: { target: 'lhs_lib.count' },
    count_d: { target: 'lhs_lib.count_d' },
    avg: { target: 'lhs_lib.avg', awaitResult: true },
    min: { target: 'lhs_lib.min', awaitResult: true },
    max: { target: 'lhs_lib.max', awaitResult: true },
    find: { target: 'lhs_lib.find' },

    app_add_para: { target: 'app_add_para', defaultArgs: [false] },
    app_add_para_cp: { target: 'app_add_para_cp' },
    app_add_para_lp: { target: 'app_add_para_lp' },

    go_item: { target: 'lhs_lib.go_item' },

    app_duplicate_record: { target: 'lhs_lib.app_duplicate_record', prependEvent: true },
    app_execute_item: { target: 'app_execute_item', prependEvent: true, awaitResult: true },
    app_execute_frame: { target: 'app_execute_frame', prependEvent: true, awaitResult: true },

    open_lov: { target: 'open_lov', prependEvent: true, awaitResult: true },
    open_lov_wd: { target: 'open_lov_wd', prependEvent: true, awaitResult: true },
    open_multi_lov: { target: 'open_multi_lov', prependEvent: true, awaitResult: true },

    app_clear_item: { target: 'lhs_lib.app_clear_item', prependEvent: true },
    app_clear_frame: { target: 'app_clear_frame' },

    app_delete_record: { target: 'app_delete_record', prependEvent: true },
    search_item: { target: 'search_item', prependEvent: true },

    app_create_table_record: { target: 'addNewRow', prependEvent: true, awaitResult: true },
    app_create_record: { target: 'app_create_record', prependEvent: true, awaitResult: true },
    app_edit_record: { target: 'app_edit_record', prependEvent: true, awaitResult: true },

    app_restore_record: { target: 'lhs_lib.app_restore_record', prependEvent: true },
    app_selected_record: { target: 'lhs_lib.app_selected_record', prependEvent: true, awaitResult: true },

    pass_frame_data: { target: 'lhs_lib.pass_frame_data' },
    go_home_page: { target: 'go_home_page' },
    app_reload_object: { target: 'app_reload_object' },

    app_open_page: {
      target: 'app_open_page',
      prependEvent: true,
      defaultArgs: (ctx) => [ctx.event],
    },

    get_object_config: { target: 'get_object_config', prependEvent: true },

    app_next_page: {
      target: 'app_open_page',
      prependEvent: true,
      defaultArgs: (ctx) => [ctx.event],
    },

    app_append_next_page: { target: 'app_append_next_page', prependEvent: true },

    get_ref_cursor: { target: 'get_ref_cursor', prependEvent: true, awaitResult: true },

    download_text: { target: 'download_text', prependEvent: true },

    app_first_record: { target: 'lhs_lib.app_first_record', awaitResult: true },
    app_last_record: { target: 'lhs_lib.app_last_record', awaitResult: true },
    app_go_record: { target: 'lhs_lib.app_go_record', awaitResult: true },
    app_previous_record: { target: 'lhs_lib.app_previous_record', awaitResult: true },
    app_next_record: { target: 'lhs_lib.app_next_record', awaitResult: true },

    next_iud_seqid: { target: 'next_iud_seqid', awaitResult: true },

    parseint: { target: 'parseInt' },
    parsefloat: { target: 'parseFloat' },

    app_collapse_frame: { target: 'lhs_lib.app_collapse_frame', awaitResult: true },
    app_uncollapse_frame: { target: 'lhs_lib.app_uncollapse_frame', awaitResult: true },
    app_collapse_item: { target: 'lhs_lib.app_collapse_item', awaitResult: true },
    app_uncollapse_item: { target: 'lhs_lib.app_uncollapse_item', awaitResult: true },

    set_row_config: { target: 'lhs_lib.set_row_config', awaitResult: true },

    app_frame_fullscreen: { target: 'app_frame_fullScreen', awaitResult: true },
    app_frame_fullscreen_: { target: 'app_frame_fullScreen', awaitResult: true },

    release_for_input: { target: 'globalobjects.stop_loading_side' },
    lock_for_input: { target: 'globalobjects.start_loading_side' },

    encrypt_value: { target: 'lhs_lib.encrypt_value', awaitResult: true },

    msgbox: { target: 'lhs_lib.msgbox', prependEvent: true, awaitResult: true },
    app_confirm_msg: { target: 'lhs_lib.app_confirm_msg', prependEvent: true, awaitResult: true },

    set_error_msg: { target: 'set_error_msg' },
    remove_error_msg: { target: 'remove_error_msg' },
  };


  constructor(private readonly host: any) { }

  async run(expression: string, event: any): Promise<any> {
    if (!expression || !expression.trim()) return;
    const ctx: EngineContext = { event, component: this.host };
    const normalized = this.normalize(expression);
    this.debug('normalized', { input: expression, normalized, event });
    const ast = this.parseSequence(normalized);
    this.debug('ast', ast);
    return await this.executeInstruction(ast, ctx);
  }

  normalize(value: string): string {
    let output = value.trim();
    output = output.replaceAll('this.', '');
    output = output.replaceAll('supercomp.', '');
    output = output.replace(/\bevent\s*,/g, '');
    output = output.replace(/\balert\s*\(/gi, 'msgbox(');
    output = output.replace(/\bAPP_/g, 'app_');
    output = output.replace(/\bparseint\s*\(/gi, 'parseInt(');
    output = output.replace(/\bparsefloat\s*\(/gi, 'parseFloat(');
    return output;
  }

  parseSequence(input: string): ParsedInstruction {
    const statements = this.splitTopLevel(input, ';').map((s) => s.trim()).filter(Boolean);

    if (statements.length === 1) {
      return this.parseStatement(statements[0]);
    }

    return {
      type: 'sequence',
      steps: statements.map((s) => this.parseStatement(s)),
    };
  }

  private parseStatement(stmt: string): ParsedInstruction {
    if (!stmt) return { type: 'literal', value: null };

    if (/^raise$/i.test(stmt)) {
      return { type: 'raise' };
    }

    const callMatch = stmt.match(/^([a-zA-Z_][\w]*)\((.*)\)$/s);
    if (callMatch) {
      const name = callMatch[1].toLowerCase();
      const argsSource = callMatch[2].trim();
      const args = argsSource ? this.parseArgs(argsSource) : [];
      return { type: 'call', name, args };
    }

    return {
      type: 'literal',
      value: this.parseValue(stmt),
    };
  }

  private parseArgs(source: string): ParsedValue[] {
    const parts = this.splitTopLevel(source, ',');
    return parts.map((p) => this.parseValue(p.trim()));
  }

  // private parseValue(token: string): ParsedValue {
  //   if (!token.length) return { kind: 'string', value: '' };

  //   if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
  //     return { kind: 'string', value: this.unquote(token) };
  //   }

  //   if (/^(true|false)$/i.test(token)) {
  //     return { kind: 'boolean', value: token.toLowerCase() === 'true' };
  //   }

  //   if (/^null$/i.test(token)) {
  //     return { kind: 'null', value: null };
  //   }

  //   if (/^-?\d+(\.\d+)?$/.test(token)) {
  //     return { kind: 'number', value: Number(token) };
  //   }

  //   if (/^\[.*\]$/s.test(token)) {
  //     const inner = token.slice(1, -1).trim();
  //     return {
  //       kind: 'array',
  //       value: inner ? this.splitTopLevel(inner, ',').map((t) => this.parseValue(t.trim())) : [],
  //     };
  //   }

  //   if (/^\{.*\}$/s.test(token)) {
  //     const inner = token.slice(1, -1).trim();
  //     const obj: Record<string, ParsedValue> = {};
  //     if (inner) {
  //       const pairs = this.splitTopLevel(inner, ',');
  //       for (const pair of pairs) {
  //         const [k, ...rest] = this.splitTopLevel(pair, ':');
  //         const key = this.unquote(k.trim());
  //         obj[key] = this.parseValue(rest.join(':').trim());
  //       }
  //     }
  //     return { kind: 'object', value: obj };
  //   }

  //   if (/^(sys_current_frame|sys_last_frame|sys_current_item|sys_last_item|sys_current_record)$/i.test(token)) {
  //     return { kind: 'sysvar', value: token.toLowerCase() };
  //   }

  //   if (/^[a-zA-Z_][\w]*\(.*\)$/s.test(token)) {
  //     return { kind: 'call', value: this.parseStatement(token) };
  //   }

  //   return { kind: 'identifier', value: token };
  // }

  private parseValue(token: string): ParsedValue {
    if (!token.length) return { kind: 'string', value: '' };

    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('`') && token.endsWith('`'))
    ) {
      return { kind: 'string', value: this.unquote(token) };
    }

    if (/^(true|false)$/i.test(token)) {
      return { kind: 'boolean', value: token.toLowerCase() === 'true' };
    }

    if (/^null$/i.test(token)) {
      return { kind: 'null', value: null };
    }

    if (/^-?\d+(\.\d+)?$/.test(token)) {
      return { kind: 'number', value: Number(token) };
    }

    if (/^\[.*\]$/s.test(token)) {
      const inner = token.slice(1, -1).trim();
      return {
        kind: 'array',
        value: inner ? this.splitTopLevel(inner, ',').map((t) => this.parseValue(t.trim())) : [],
      };
    }

    if (/^\{.*\}$/s.test(token)) {
      const inner = token.slice(1, -1).trim();
      const obj: Record<string, ParsedValue> = {};
      if (inner) {
        const pairs = this.splitTopLevel(inner, ',');
        for (const pair of pairs) {
          const [k, ...rest] = this.splitTopLevel(pair, ':');
          const key = this.unquote(k.trim());
          obj[key] = this.parseValue(rest.join(':').trim());
        }
      }
      return { kind: 'object', value: obj };
    }

    if (/^(sys_current_frame|sys_last_frame|sys_current_item|sys_last_item|sys_current_record)$/i.test(token)) {
      return { kind: 'sysvar', value: token.toLowerCase() };
    }

    if (/^[a-zA-Z_][\w]*\(.*\)$/s.test(token)) {
      return { kind: 'call', value: this.parseStatement(token) };
    }

    return { kind: 'identifier', value: token };
  }

  private unquote(value: string): string {
    const quote = value[0];
    let inner = value.slice(1, -1);

    if (quote === '"') {
      inner = inner.replace(/\\"/g, '"');
    }

    if (quote === "'") {
      inner = inner.replace(/\\'/g, "'");
    }

    if (quote === '`') {
      inner = inner.replace(/\\`/g, '`');
    }

    return inner.replace(/\\n/g, '\n');
  }

  // private unquote(value: string): string {
  //   const quote = value[0];
  //   let inner = value.slice(1, -1);

  //   if (quote === '"') inner = inner.replace(/\\"/g, '"');
  //   if (quote === "'") inner = inner.replace(/\\'/g, "'");

  //   return inner.replace(/\\n/g, '\n');
  // }

  // private splitTopLevel(input: string, delimiter: string): string[] {
  //   const parts: string[] = [];
  //   let current = '';
  //   let paren = 0;
  //   let square = 0;
  //   let curly = 0;
  //   let inSingle = false;
  //   let inDouble = false;
  //   let prev = '';

  //   for (const ch of input) {
  //     if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
  //     else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
  //     else if (!inSingle && !inDouble) {
  //       if (ch === '(') paren++;
  //       else if (ch === ')') paren--;
  //       else if (ch === '[') square++;
  //       else if (ch === ']') square--;
  //       else if (ch === '{') curly++;
  //       else if (ch === '}') curly--;
  //     }

  //     if (!inSingle && !inDouble && paren === 0 && square === 0 && curly === 0 && ch === delimiter) {
  //       parts.push(current);
  //       current = '';
  //     } else {
  //       current += ch;
  //     }

  //     prev = ch;
  //   }

  //   if (current.length) parts.push(current);
  //   return parts;
  // }

  private splitTopLevel(input: string, delimiter: string): string[] {
    const parts: string[] = [];
    let current = '';

    let paren = 0;
    let square = 0;
    let curly = 0;

    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;

    let prev = '';

    for (const ch of input) {
      if (ch === "'" && !inDouble && !inBacktick && prev !== '\\') {
        inSingle = !inSingle;
      } else if (ch === '"' && !inSingle && !inBacktick && prev !== '\\') {
        inDouble = !inDouble;
      } else if (ch === '`' && !inSingle && !inDouble && prev !== '\\') {
        inBacktick = !inBacktick;
      } else if (!inSingle && !inDouble && !inBacktick) {
        if (ch === '(') paren++;
        else if (ch === ')') paren--;
        else if (ch === '[') square++;
        else if (ch === ']') square--;
        else if (ch === '{') curly++;
        else if (ch === '}') curly--;
      }

      if (
        !inSingle &&
        !inDouble &&
        !inBacktick &&
        paren === 0 &&
        square === 0 &&
        curly === 0 &&
        ch === delimiter
      ) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }

      prev = ch;
    }

    if (current.trim().length) {
      parts.push(current.trim());
    }

    return parts;
  }

  private async executeInstruction(instr: ParsedInstruction, ctx: EngineContext): Promise<any> {
    switch (instr.type) {
      case 'sequence': {
        let last: any;
        for (const step of instr.steps || []) {
          last = await this.executeInstruction(step, ctx);
        }
        return last;
      }

      case 'raise':
        return this.handleRaise(ctx);

      case 'literal':
        return instr.value;

      case 'call':
        return this.executeCall(instr, ctx);

      default:
        return undefined;
    }
  }

  private async executeCall(instr: ParsedInstruction, ctx: EngineContext): Promise<any> {
    const name = (instr.name || '').toLowerCase();
    const config = this.functionMap[name];

    if (!config) {
      throw new Error(`Unsupported function: ${name}`);
    }

    const fn = this.resolveTarget(config.target);
    if (typeof fn !== 'function') {
      throw new Error(`Target not callable: ${config.target}`);
    }

    const resolvedArgs: any[] = [];

    if (config.prependEvent) {
      resolvedArgs.push(ctx.event);
    }

    if (config.defaultArgs) {
      const defaults = typeof config.defaultArgs === 'function'
        ? config.defaultArgs(ctx)
        : config.defaultArgs;
      resolvedArgs.push(...defaults);
    }

    for (const arg of instr.args || []) {
      resolvedArgs.push(await this.resolveValue(arg, ctx));
    }

    this.debug('call:start', { name, target: config.target, args: resolvedArgs });

    const result = fn(...resolvedArgs);
    const finalResult = config.awaitResult ? await result : result;

    this.debug('call:end', { name, result: finalResult });

    if (name === 'msgbox' && ctx.event?.rase) {
      return this.handleRaise(ctx);
    }

    if (name === 'app_required_record' && finalResult?.rase) {
      return this.handleRaise(ctx);
    }

    if (name === 'app_required_frame' && finalResult?.rase) {
      ctx.component?.globalobjects?.setFocus?.(true);
      return this.handleRaise(ctx);
    }

    return finalResult;
  }

  private async resolveValue(value: ParsedValue, ctx: EngineContext): Promise<any> {
    switch (value.kind) {
      case 'string':
      case 'number':
      case 'boolean':
        return value.value;

      case 'null':
        return null;

      case 'identifier':
        return this.resolveIdentifier(value.value, ctx);

      case 'sysvar':
        return this.resolveSysVar(value.value);

      case 'call':
        return await this.executeInstruction(value.value, ctx);

      case 'array': {
        const result = [];
        for (const item of value.value) {
          result.push(await this.resolveValue(item, ctx));
        }
        return result;
      }

      case 'object': {
        const out: Record<string, any> = {};
        for (const key of Object.keys(value.value)) {
          out[key] = await this.resolveValue(value.value[key], ctx);
        }
        return out;
      }

      default:
        return undefined;
    }
  }

  private resolveIdentifier(identifier: string, ctx: EngineContext): any {
    const cleaned = identifier.trim();

    if (cleaned === 'event') return ctx.event;
    if (cleaned === 'supercomp') return ctx.component;
    if (cleaned === 'this') return ctx.component;

    if (cleaned.includes('.')) {
      return this.resolvePath(cleaned, {
        event: ctx.event,
        supercomp: ctx.component,
        component: ctx.component,
        host: ctx.component,
        lhs_lib: ctx.component?.lhs_lib,
        globalobjects: ctx.component?.globalobjects,
      });
    }

    if (ctx.event && cleaned in ctx.event) return ctx.event[cleaned];
    if (ctx.component && cleaned in ctx.component) return ctx.component[cleaned];
    if (ctx.component?.lhs_lib && cleaned in ctx.component.lhs_lib) return ctx.component.lhs_lib[cleaned];
    if (ctx.component?.globalobjects && cleaned in ctx.component.globalobjects) return ctx.component.globalobjects[cleaned];

    return cleaned;
  }

  private resolveSysVar(name: string): any {
    switch (name) {
      case 'sys_current_frame':
        return this.host?.lhs_lib?.sys_current_frame;
      case 'sys_last_frame':
        return this.host?.lhs_lib?.sys_last_frame;
      case 'sys_current_item':
        return this.host?.lhs_lib?.sys_current_item;
      case 'sys_last_item':
        return this.host?.lhs_lib?.sys_last_item;
      case 'sys_current_record':
        return this.host?.lhs_lib?.sys_current_rownumber;
      default:
        return undefined;
    }
  }

  private resolveTarget(path: string): (...args: any[]) => any {
    if (path === 'parseInt') return parseInt as any;
    if (path === 'parseFloat') return parseFloat as any;

    const fn = this.resolvePath(path, this.host);
    return typeof fn === 'function' ? fn.bind(this.resolveParent(path, this.host)) : fn;
  }

  private resolvePath(path: string, root: any): any {
    return path.split('.').reduce((acc, part) => acc?.[part], root);
  }

  private resolveParent(path: string, root: any): any {
    const parts = path.split('.');
    if (parts.length === 1) return root;
    parts.pop();
    return this.resolvePath(parts.join('.'), root);
  }

  private handleRaise(ctx: EngineContext): never {
    ctx.component?.doAfterRaise?.(ctx.event);
    throw new Error('Code Raised');
  }

  private debug(label: string, data: any): void {
    if (!this.host?.globalobjects?.logFlag) return;
    console.log(`[DynamicEventEngine] ${label}`, data);
  }
}