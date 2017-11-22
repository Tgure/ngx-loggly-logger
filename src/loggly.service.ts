import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LogglyService {
  private LOGGLY_INPUT_PREFIX: any;
  private LOGGLY_COLLECTOR_DOMAIN: any;
  private LOGGLY_SESSION_KEY: any;
  private LOGGLY_SESSION_KEY_LENGTH: any;
  private LOGGLY_PROXY_DOMAIN: any;
  private session_id: any;
  private inputUrl: any;

  constructor(private _http: HttpClient) {
      this.LOGGLY_INPUT_PREFIX = 'http' + ( ('https:' === document.location.protocol ? 's' : '') ) + '://';
      this.LOGGLY_COLLECTOR_DOMAIN = 'logs-01.loggly.com';
      this.LOGGLY_SESSION_KEY = 'logglytrackingsession';
      this.LOGGLY_SESSION_KEY_LENGTH = this.LOGGLY_SESSION_KEY + 1;
      this.LOGGLY_PROXY_DOMAIN = 'loggly';
  }

    uuid() {
        // lifted from here -> http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    setKey(tracker: any, key: any) {
        tracker.key = key;
        tracker.setSession();
        this.setInputUrl(tracker);
    }

    setTag(tracker: any, tag: any) {
        tracker.tag = tag;
    }

    setDomainProxy(tracker: any, useDomainProxy: any) {
        tracker.useDomainProxy = useDomainProxy;
        // refresh inputUrl value
        this.setInputUrl(tracker);
    }

    setSendConsoleError(tracker: any, sendConsoleErrors: any) {
        tracker.sendConsoleErrors = sendConsoleErrors;

        if (tracker.sendConsoleErrors === true) {
            let _onerror = window.onerror;
            // send console error messages to Loggly
            window.onerror = function (msg, url, line, col) {
                tracker.push({
                    category: 'BrowserJsException',
                    exception: {
                        message: msg,
                        url: url,
                        lineno: line,
                        colno: col,
                    }
                });

                if (_onerror && typeof _onerror === 'function') {
                    _onerror.apply(window, arguments);
                }
            };
        }
    }

    setInputUrl(tracker: any) {
        if (tracker.useDomainProxy === true) {
            tracker.inputUrl = this.LOGGLY_INPUT_PREFIX
                + window.location.host
                + '/'
                + this.LOGGLY_PROXY_DOMAIN
                + '/inputs/'
                + tracker.key
                + '/tag/'
                + tracker.tag;
        } else {
            tracker.inputUrl = this.LOGGLY_INPUT_PREFIX
                + (tracker.logglyCollectorDomain || this.LOGGLY_COLLECTOR_DOMAIN)
                + '/inputs/'
                + tracker.key
                + '/tag/'
                + tracker.tag;
        }
    }

    setSession(session_id: any) {
        if (session_id) {
            this.session_id = session_id;
            this.setCookie(this.session_id);
        } else if (!this.session_id) {
            this.session_id = this.readCookie();
            if (!this.session_id) {
                this.session_id = this.uuid();
                this.setCookie(this.session_id);
            }
        }
    }

    push(data: any) {
        let type = typeof data;

        if (!data || !(type === 'object' || type === 'string')) {
            return;
        }

        let self: any = this;


        if (type === 'string') {
            data = {
                'text': data
            };
        } else {
            if (data.logglyCollectorDomain) {
                self.logglyCollectorDomain = data.logglyCollectorDomain;
                return;
            }

            if (data.sendConsoleErrors !== undefined) {
                this.setSendConsoleError(self, data.sendConsoleErrors);
            }

            if (data.tag) {
                this.setTag(self, data.tag);
            }

            if (data.useDomainProxy) {
                this.setDomainProxy(self, data.useDomainProxy);
            }

            if (data.logglyKey) {
                this.setKey(self, data.logglyKey);
                return;
            }

            if (data.session_id) {
                self.setSession(data.session_id);
                return;
            }
        }

        if (!self.key) {
            return;
        }

        self.track(data).subscribe(
            (response: any) => {
                // Success
            },
            (error: any) => {
                console.error(error);
            });
    }

    track(data: any) {
        // inject session id
        data.sessionId = this.session_id;
        return this._http.post(this.inputUrl, data, { headers: new HttpHeaders().set('Content-Type', 'text/plain') })
            .map(res => res);
    }

    readCookie(): any {
        let cookie = Cookie.get(this.LOGGLY_SESSION_KEY);
        if (cookie) {
            let i = cookie.indexOf(this.LOGGLY_SESSION_KEY);
            if (i < 0) {
                return false;
            } else {
                let end = cookie.indexOf(';', i + 1);
                end = end < 0 ? cookie.length : end;
                return cookie.slice(i + this.LOGGLY_SESSION_KEY_LENGTH, end);
            }
        } else {
            return false;
        }
    }

    setCookie(value: any) {
        Cookie.set(this.LOGGLY_SESSION_KEY, value);
    }
}
