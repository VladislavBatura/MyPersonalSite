"use strict";
(self.webpackChunkmy_app = self.webpackChunkmy_app || []).push([
  [179],
  {
    435: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function go(e) {
        const t = e((i) => {
          Error.call(i), (i.stack = new Error().stack);
        });
        return (
          (t.prototype = Object.create(Error.prototype)),
          (t.prototype.constructor = t),
          t
        );
      }
      const Ws = go(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((i, r) => `${r + 1}) ${i.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = t);
          }
      );
      function lr(e, n) {
        if (e) {
          const t = e.indexOf(n);
          0 <= t && e.splice(t, 1);
        }
      }
      class Ot {
        constructor(n) {
          (this.initialTeardown = n),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let n;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t)))
                for (const o of t) o.remove(this);
              else t.remove(this);
            const { initialTeardown: i } = this;
            if (ne(i))
              try {
                i();
              } catch (o) {
                n = o instanceof Ws ? o.errors : [o];
              }
            const { _finalizers: r } = this;
            if (r) {
              this._finalizers = null;
              for (const o of r)
                try {
                  Yh(o);
                } catch (s) {
                  (n = null != n ? n : []),
                    s instanceof Ws ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new Ws(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) Yh(n);
            else {
              if (n instanceof Ot) {
                if (n.closed || n._hasParent(this)) return;
                n._addParent(this);
              }
              (this._finalizers =
                null !== (t = this._finalizers) && void 0 !== t ? t : []).push(
                n
              );
            }
        }
        _hasParent(n) {
          const { _parentage: t } = this;
          return t === n || (Array.isArray(t) && t.includes(n));
        }
        _addParent(n) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
        }
        _removeParent(n) {
          const { _parentage: t } = this;
          t === n ? (this._parentage = null) : Array.isArray(t) && lr(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && lr(t, n), n instanceof Ot && n._removeParent(this);
        }
      }
      Ot.EMPTY = (() => {
        const e = new Ot();
        return (e.closed = !0), e;
      })();
      const Wh = Ot.EMPTY;
      function zh(e) {
        return (
          e instanceof Ot ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function Yh(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const Oi = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        zs = {
          setTimeout(e, n, ...t) {
            const { delegate: i } = zs;
            return (null == i ? void 0 : i.setTimeout)
              ? i.setTimeout(e, n, ...t)
              : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = zs;
            return ((null == n ? void 0 : n.clearTimeout) || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function qh(e) {
        zs.setTimeout(() => {
          const { onUnhandledError: n } = Oi;
          if (!n) throw e;
          n(e);
        });
      }
      function ur() {}
      const mC = du("C", void 0, void 0);
      function du(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let Ri = null;
      function Ys(e) {
        if (Oi.useDeprecatedSynchronousErrorHandling) {
          const n = !Ri;
          if ((n && (Ri = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: i } = Ri;
            if (((Ri = null), t)) throw i;
          }
        } else e();
      }
      class fu extends Ot {
        constructor(n) {
          super(),
            (this.isStopped = !1),
            n
              ? ((this.destination = n), zh(n) && n.add(this))
              : (this.destination = wC);
        }
        static create(n, t, i) {
          return new qs(n, t, i);
        }
        next(n) {
          this.isStopped
            ? pu(
                (function vC(e) {
                  return du("N", e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? pu(
                (function _C(e) {
                  return du("E", void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped
            ? pu(mC, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(n) {
          this.destination.next(n);
        }
        _error(n) {
          try {
            this.destination.error(n);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const bC = Function.prototype.bind;
      function hu(e, n) {
        return bC.call(e, n);
      }
      class DC {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (i) {
              Js(i);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (i) {
              Js(i);
            }
          else Js(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              Js(t);
            }
        }
      }
      class qs extends fu {
        constructor(n, t, i) {
          let r;
          if ((super(), ne(n) || !n))
            r = {
              next: null != n ? n : void 0,
              error: null != t ? t : void 0,
              complete: null != i ? i : void 0,
            };
          else {
            let o;
            this && Oi.useDeprecatedNextContext
              ? ((o = Object.create(n)),
                (o.unsubscribe = () => this.unsubscribe()),
                (r = {
                  next: n.next && hu(n.next, o),
                  error: n.error && hu(n.error, o),
                  complete: n.complete && hu(n.complete, o),
                }))
              : (r = n);
          }
          this.destination = new DC(r);
        }
      }
      function Js(e) {
        Oi.useDeprecatedSynchronousErrorHandling
          ? (function yC(e) {
              Oi.useDeprecatedSynchronousErrorHandling &&
                Ri &&
                ((Ri.errorThrown = !0), (Ri.error = e));
            })(e)
          : qh(e);
      }
      function pu(e, n) {
        const { onStoppedNotification: t } = Oi;
        t && zs.setTimeout(() => t(e, n));
      }
      const wC = {
          closed: !0,
          next: ur,
          error: function CC(e) {
            throw e;
          },
          complete: ur,
        },
        gu =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function $n(e) {
        return e;
      }
      let ge = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const i = new e();
            return (i.source = this), (i.operator = t), i;
          }
          subscribe(t, i, r) {
            const o = (function NC(e) {
              return (
                (e && e instanceof fu) ||
                ((function EC(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  zh(e))
              );
            })(t)
              ? t
              : new qs(t, i, r);
            return (
              Ys(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (i) {
              t.error(i);
            }
          }
          forEach(t, i) {
            return new (i = Zh(i))((r, o) => {
              const s = new qs({
                next: (a) => {
                  try {
                    t(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: r,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var i;
            return null === (i = this.source) || void 0 === i
              ? void 0
              : i.subscribe(t);
          }
          [gu]() {
            return this;
          }
          pipe(...t) {
            return (function Jh(e) {
              return 0 === e.length
                ? $n
                : 1 === e.length
                ? e[0]
                : function (t) {
                    return e.reduce((i, r) => r(i), t);
                  };
            })(t)(this);
          }
          toPromise(t) {
            return new (t = Zh(t))((i, r) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => r(s),
                () => i(o)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function Zh(e) {
        var n;
        return null !== (n = null != e ? e : Oi.Promise) && void 0 !== n
          ? n
          : Promise;
      }
      const MC = go(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Ae = (() => {
        class e extends ge {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const i = new Qh(this, this);
            return (i.operator = t), i;
          }
          _throwIfClosed() {
            if (this.closed) throw new MC();
          }
          next(t) {
            Ys(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const i of this.currentObservers) i.next(t);
              }
            });
          }
          error(t) {
            Ys(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: i } = this;
                for (; i.length; ) i.shift().error(t);
              }
            });
          }
          complete() {
            Ys(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (
              (null === (t = this.observers) || void 0 === t
                ? void 0
                : t.length) > 0
            );
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(t),
              this._innerSubscribe(t)
            );
          }
          _innerSubscribe(t) {
            const { hasError: i, isStopped: r, observers: o } = this;
            return i || r
              ? Wh
              : ((this.currentObservers = null),
                o.push(t),
                new Ot(() => {
                  (this.currentObservers = null), lr(o, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: i, thrownError: r, isStopped: o } = this;
            i ? t.error(r) : o && t.complete();
          }
          asObservable() {
            const t = new ge();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new Qh(n, t)), e;
      })();
      class Qh extends Ae {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, i;
          null ===
            (i =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.next) ||
            void 0 === i ||
            i.call(t, n);
        }
        error(n) {
          var t, i;
          null ===
            (i =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.error) ||
            void 0 === i ||
            i.call(t, n);
        }
        complete() {
          var n, t;
          null ===
            (t =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, i;
          return null !==
            (i =
              null === (t = this.source) || void 0 === t
                ? void 0
                : t.subscribe(n)) && void 0 !== i
            ? i
            : Wh;
        }
      }
      function Kh(e) {
        return ne(null == e ? void 0 : e.lift);
      }
      function Pe(e) {
        return (n) => {
          if (Kh(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (i) {
                this.error(i);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function be(e, n, t, i, r) {
        return new TC(e, n, t, i, r);
      }
      class TC extends fu {
        constructor(n, t, i, r, o, s) {
          super(n),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (l) {
                    n.error(l);
                  }
                }
              : super._next),
            (this._error = r
              ? function (a) {
                  try {
                    r(a);
                  } catch (l) {
                    n.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = i
              ? function () {
                  try {
                    i();
                  } catch (a) {
                    n.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var n;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(),
              !t &&
                (null === (n = this.onFinalize) ||
                  void 0 === n ||
                  n.call(this));
          }
        }
      }
      function K(e, n) {
        return Pe((t, i) => {
          let r = 0;
          t.subscribe(
            be(i, (o) => {
              i.next(e.call(n, o, r++));
            })
          );
        });
      }
      function xi(e) {
        return this instanceof xi ? ((this.v = e), this) : new xi(e);
      }
      function IC(e, n, t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var r,
          i = t.apply(e, n || []),
          o = [];
        return (
          (r = {}),
          s("next"),
          s("throw"),
          s("return"),
          (r[Symbol.asyncIterator] = function () {
            return this;
          }),
          r
        );
        function s(f) {
          i[f] &&
            (r[f] = function (h) {
              return new Promise(function (p, g) {
                o.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function l(f) {
              f.value instanceof xi
                ? Promise.resolve(f.value.v).then(u, c)
                : d(o[0][2], f);
            })(i[f](h));
          } catch (p) {
            d(o[0][3], p);
          }
        }
        function u(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      }
      function OC(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function tp(e) {
              var n = "function" == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                i = 0;
              if (t) return t.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && i >= e.length && (e = void 0),
                      { value: e && e[i++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                n
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (t = {}),
            i("next"),
            i("throw"),
            i("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function i(o) {
          t[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function r(o, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    o({ value: u, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const _u = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function np(e) {
        return ne(null == e ? void 0 : e.then);
      }
      function ip(e) {
        return ne(e[gu]);
      }
      function rp(e) {
        return (
          Symbol.asyncIterator &&
          ne(null == e ? void 0 : e[Symbol.asyncIterator])
        );
      }
      function op(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const sp = (function xC() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function ap(e) {
        return ne(null == e ? void 0 : e[sp]);
      }
      function lp(e) {
        return IC(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: i, done: r } = yield xi(t.read());
              if (r) return yield xi(void 0);
              yield yield xi(i);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function up(e) {
        return ne(null == e ? void 0 : e.getReader);
      }
      function st(e) {
        if (e instanceof ge) return e;
        if (null != e) {
          if (ip(e))
            return (function PC(e) {
              return new ge((n) => {
                const t = e[gu]();
                if (ne(t.subscribe)) return t.subscribe(n);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (_u(e))
            return (function kC(e) {
              return new ge((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (np(e))
            return (function FC(e) {
              return new ge((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, qh);
              });
            })(e);
          if (rp(e)) return cp(e);
          if (ap(e))
            return (function LC(e) {
              return new ge((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (up(e))
            return (function VC(e) {
              return cp(lp(e));
            })(e);
        }
        throw op(e);
      }
      function cp(e) {
        return new ge((n) => {
          (function BC(e, n) {
            var t, i, r, o;
            return (function SC(e, n, t, i) {
              return new (t || (t = Promise))(function (o, s) {
                function a(c) {
                  try {
                    u(i.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(i.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? o(c.value)
                    : (function r(o) {
                        return o instanceof t
                          ? o
                          : new t(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, l);
                }
                u((i = i.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = OC(e); !(i = yield t.next()).done; )
                  if ((n.next(i.value), n.closed)) return;
              } catch (s) {
                r = { error: s };
              } finally {
                try {
                  i && !i.done && (o = t.return) && (yield o.call(t));
                } finally {
                  if (r) throw r.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function Un(e, n, t, i = 0, r = !1) {
        const o = n.schedule(function () {
          t(), r ? e.add(this.schedule(null, i)) : this.unsubscribe();
        }, i);
        if ((e.add(o), !r)) return o;
      }
      function je(e, n, t = 1 / 0) {
        return ne(n)
          ? je((i, r) => K((o, s) => n(i, o, r, s))(st(e(i, r))), t)
          : ("number" == typeof n && (t = n),
            Pe((i, r) =>
              (function jC(e, n, t, i, r, o, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && n.complete();
                  },
                  h = (g) => (u < i ? p(g) : l.push(g)),
                  p = (g) => {
                    o && n.next(g), u++;
                    let v = !1;
                    st(t(g, c++)).subscribe(
                      be(
                        n,
                        (y) => {
                          null == r || r(y), o ? h(y) : n.next(y);
                        },
                        () => {
                          v = !0;
                        },
                        void 0,
                        () => {
                          if (v)
                            try {
                              for (u--; l.length && u < i; ) {
                                const y = l.shift();
                                s ? Un(n, s, () => p(y)) : p(y);
                              }
                              f();
                            } catch (y) {
                              n.error(y);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    be(n, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    null == a || a();
                  }
                );
              })(i, r, e, t)
            ));
      }
      function mo(e = 1 / 0) {
        return je($n, e);
      }
      const rn = new ge((e) => e.complete());
      function dp(e) {
        return e && ne(e.schedule);
      }
      function vu(e) {
        return e[e.length - 1];
      }
      function Zs(e) {
        return ne(vu(e)) ? e.pop() : void 0;
      }
      function _o(e) {
        return dp(vu(e)) ? e.pop() : void 0;
      }
      function fp(e, n = 0) {
        return Pe((t, i) => {
          t.subscribe(
            be(
              i,
              (r) => Un(i, e, () => i.next(r), n),
              () => Un(i, e, () => i.complete(), n),
              (r) => Un(i, e, () => i.error(r), n)
            )
          );
        });
      }
      function hp(e, n = 0) {
        return Pe((t, i) => {
          i.add(e.schedule(() => t.subscribe(i), n));
        });
      }
      function pp(e, n) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ge((t) => {
          Un(t, n, () => {
            const i = e[Symbol.asyncIterator]();
            Un(
              t,
              n,
              () => {
                i.next().then((r) => {
                  r.done ? t.complete() : t.next(r.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Ke(e, n) {
        return n
          ? (function qC(e, n) {
              if (null != e) {
                if (ip(e))
                  return (function UC(e, n) {
                    return st(e).pipe(hp(n), fp(n));
                  })(e, n);
                if (_u(e))
                  return (function WC(e, n) {
                    return new ge((t) => {
                      let i = 0;
                      return n.schedule(function () {
                        i === e.length
                          ? t.complete()
                          : (t.next(e[i++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (np(e))
                  return (function GC(e, n) {
                    return st(e).pipe(hp(n), fp(n));
                  })(e, n);
                if (rp(e)) return pp(e, n);
                if (ap(e))
                  return (function zC(e, n) {
                    return new ge((t) => {
                      let i;
                      return (
                        Un(t, n, () => {
                          (i = e[sp]()),
                            Un(
                              t,
                              n,
                              () => {
                                let r, o;
                                try {
                                  ({ value: r, done: o } = i.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                o ? t.complete() : t.next(r);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(null == i ? void 0 : i.return) && i.return()
                      );
                    });
                  })(e, n);
                if (up(e))
                  return (function YC(e, n) {
                    return pp(lp(e), n);
                  })(e, n);
              }
              throw op(e);
            })(e, n)
          : st(e);
      }
      function at(e) {
        return e <= 0
          ? () => rn
          : Pe((n, t) => {
              let i = 0;
              n.subscribe(
                be(t, (r) => {
                  ++i <= e && (t.next(r), e <= i && t.complete());
                })
              );
            });
      }
      function yu(e, n, ...t) {
        return !0 === n
          ? (e(), null)
          : !1 === n
          ? null
          : n(...t)
              .pipe(at(1))
              .subscribe(() => e());
      }
      function fe(e) {
        for (let n in e) if (e[n] === fe) return n;
        throw Error("Could not find renamed property on target object.");
      }
      function oe(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(oe).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return "" + n;
        const t = n.indexOf("\n");
        return -1 === t ? n : n.substring(0, t);
      }
      function Du(e, n) {
        return null == e || "" === e
          ? null === n
            ? ""
            : n
          : null == n || "" === n
          ? e
          : e + " " + n;
      }
      const QC = fe({ __forward_ref__: fe });
      function ie(e) {
        return (
          (e.__forward_ref__ = ie),
          (e.toString = function () {
            return oe(this());
          }),
          e
        );
      }
      function j(e) {
        return (function gp(e) {
          return (
            "function" == typeof e &&
            e.hasOwnProperty(QC) &&
            e.__forward_ref__ === ie
          );
        })(e)
          ? e()
          : e;
      }
      class X extends Error {
        constructor(n, t) {
          super(
            (function Cu(e, n) {
              return `NG0${Math.abs(e)}${n ? ": " + n : ""}`;
            })(n, t)
          ),
            (this.code = n);
        }
      }
      function L(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function pt(e) {
        return "function" == typeof e
          ? e.name || e.toString()
          : "object" == typeof e && null != e && "function" == typeof e.type
          ? e.type.name || e.type.toString()
          : L(e);
      }
      function Qs(e, n) {
        const t = n ? ` in ${n}` : "";
        throw new X(-201, `No provider for ${pt(e)} found${t}`);
      }
      function De(e, n, t, i) {
        throw new Error(
          `ASSERTION ERROR: ${e}` +
            (null == i ? "" : ` [Expected=> ${t} ${i} ${n} <=Actual]`)
        );
      }
      function x(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function se(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function wu(e) {
        return mp(e, Ks) || mp(e, vp);
      }
      function mp(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function _p(e) {
        return e && (e.hasOwnProperty(Eu) || e.hasOwnProperty(rw))
          ? e[Eu]
          : null;
      }
      const Ks = fe({ ??prov: fe }),
        Eu = fe({ ??inj: fe }),
        vp = fe({ ngInjectableDef: fe }),
        rw = fe({ ngInjectorDef: fe });
      var F = (() => (
        ((F = F || {})[(F.Default = 0)] = "Default"),
        (F[(F.Host = 1)] = "Host"),
        (F[(F.Self = 2)] = "Self"),
        (F[(F.SkipSelf = 4)] = "SkipSelf"),
        (F[(F.Optional = 8)] = "Optional"),
        F
      ))();
      let Nu;
      function di(e) {
        const n = Nu;
        return (Nu = e), n;
      }
      function yp(e, n, t) {
        const i = wu(e);
        return i && "root" == i.providedIn
          ? void 0 === i.value
            ? (i.value = i.factory())
            : i.value
          : t & F.Optional
          ? null
          : void 0 !== n
          ? n
          : void Qs(oe(e), "Injector");
      }
      function fi(e) {
        return { toString: e }.toString();
      }
      var on = (() => (
          ((on = on || {})[(on.OnPush = 0)] = "OnPush"),
          (on[(on.Default = 1)] = "Default"),
          on
        ))(),
        Nn = (() => {
          return (
            ((e = Nn || (Nn = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Nn
          );
          var e;
        })();
      const sw = "undefined" != typeof globalThis && globalThis,
        aw = "undefined" != typeof window && window,
        lw =
          "undefined" != typeof self &&
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        ue = sw || ("undefined" != typeof global && global) || aw || lw,
        cr = {},
        he = [],
        Xs = fe({ ??cmp: fe }),
        Mu = fe({ ??dir: fe }),
        Tu = fe({ ??pipe: fe }),
        bp = fe({ ??mod: fe }),
        Wn = fe({ ??fac: fe }),
        vo = fe({ __NG_ELEMENT_ID__: fe });
      let uw = 0;
      function gt(e) {
        return fi(() => {
          const t = {},
            i = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: t,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === on.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: e.selectors || he,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Nn.Emulated,
              id: "c",
              styles: e.styles || he,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            r = e.directives,
            o = e.features,
            s = e.pipes;
          return (
            (i.id += uw++),
            (i.inputs = Ep(e.inputs, t)),
            (i.outputs = Ep(e.outputs)),
            o && o.forEach((a) => a(i)),
            (i.directiveDefs = r
              ? () => ("function" == typeof r ? r() : r).map(Dp)
              : null),
            (i.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(Cp)
              : null),
            i
          );
        });
      }
      function Dp(e) {
        return (
          lt(e) ||
          (function hi(e) {
            return e[Mu] || null;
          })(e)
        );
      }
      function Cp(e) {
        return (function Pi(e) {
          return e[Tu] || null;
        })(e);
      }
      const wp = {};
      function ce(e) {
        return fi(() => {
          const n = {
            type: e.type,
            bootstrap: e.bootstrap || he,
            declarations: e.declarations || he,
            imports: e.imports || he,
            exports: e.exports || he,
            transitiveCompileScopes: null,
            schemas: e.schemas || null,
            id: e.id || null,
          };
          return null != e.id && (wp[e.id] = e.type), n;
        });
      }
      function Ep(e, n) {
        if (null == e) return cr;
        const t = {};
        for (const i in e)
          if (e.hasOwnProperty(i)) {
            let r = e[i],
              o = r;
            Array.isArray(r) && ((o = r[1]), (r = r[0])),
              (t[r] = i),
              n && (n[r] = o);
          }
        return t;
      }
      const C = gt;
      function Tt(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function lt(e) {
        return e[Xs] || null;
      }
      function Wt(e, n) {
        const t = e[bp] || null;
        if (!t && !0 === n)
          throw new Error(`Type ${oe(e)} does not have '\u0275mod' property.`);
        return t;
      }
      const H = 11;
      function Mn(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function an(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function Iu(e) {
        return 0 != (8 & e.flags);
      }
      function ia(e) {
        return 2 == (2 & e.flags);
      }
      function ra(e) {
        return 1 == (1 & e.flags);
      }
      function ln(e) {
        return null !== e.template;
      }
      function gw(e) {
        return 0 != (512 & e[2]);
      }
      function Vi(e, n) {
        return e.hasOwnProperty(Wn) ? e[Wn] : null;
      }
      class vw {
        constructor(n, t, i) {
          (this.previousValue = n),
            (this.currentValue = t),
            (this.firstChange = i);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Mp(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = bw), yw;
      }
      function yw() {
        const e = Sp(this),
          n = null == e ? void 0 : e.current;
        if (n) {
          const t = e.previous;
          if (t === cr) e.previous = n;
          else for (let i in n) t[i] = n[i];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function bw(e, n, t, i) {
        const r =
            Sp(e) ||
            (function Dw(e, n) {
              return (e[Tp] = n);
            })(e, { previous: cr, current: null }),
          o = r.current || (r.current = {}),
          s = r.previous,
          a = this.declaredInputs[t],
          l = s[a];
        (o[a] = new vw(l && l.currentValue, n, s === cr)), (e[i] = n);
      }
      const Tp = "__ngSimpleChanges__";
      function Sp(e) {
        return e[Tp] || null;
      }
      let ku;
      function Fu() {
        return void 0 !== ku
          ? ku
          : "undefined" != typeof document
          ? document
          : void 0;
      }
      function Ie(e) {
        return !!e.listen;
      }
      const Ap = { createRenderer: (e, n) => Fu() };
      function He(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function oa(e, n) {
        return He(n[e]);
      }
      function qt(e, n) {
        return He(n[e.index]);
      }
      function Lu(e, n) {
        return e.data[n];
      }
      function kt(e, n) {
        const t = n[e];
        return Mn(t) ? t : t[0];
      }
      function Ip(e) {
        return 4 == (4 & e[2]);
      }
      function Vu(e) {
        return 128 == (128 & e[2]);
      }
      function pi(e, n) {
        return null == n ? null : e[n];
      }
      function Op(e) {
        e[18] = 0;
      }
      function Bu(e, n) {
        e[5] += n;
        let t = e,
          i = e[3];
        for (
          ;
          null !== i && ((1 === n && 1 === t[5]) || (-1 === n && 0 === t[5]));

        )
          (i[5] += n), (t = i), (i = i[3]);
      }
      const P = {
        lFrame: Bp(null),
        bindingsEnabled: !0,
        isInCheckNoChangesMode: !1,
      };
      function Rp() {
        return P.bindingsEnabled;
      }
      function b() {
        return P.lFrame.lView;
      }
      function ee() {
        return P.lFrame.tView;
      }
      function ze() {
        let e = xp();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function xp() {
        return P.lFrame.currentTNode;
      }
      function Co() {
        const e = P.lFrame,
          n = e.currentTNode;
        return e.isParent ? n : n.parent;
      }
      function Tn(e, n) {
        const t = P.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function ju() {
        return P.lFrame.isParent;
      }
      function Hu() {
        P.lFrame.isParent = !1;
      }
      function sa() {
        return P.isInCheckNoChangesMode;
      }
      function aa(e) {
        P.isInCheckNoChangesMode = e;
      }
      function Yn() {
        return P.lFrame.bindingIndex;
      }
      function mr() {
        return P.lFrame.bindingIndex++;
      }
      function qn(e) {
        const n = P.lFrame,
          t = n.bindingIndex;
        return (n.bindingIndex = n.bindingIndex + e), t;
      }
      function kp(e) {
        P.lFrame.inI18n = e;
      }
      function Vw(e, n) {
        const t = P.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), $u(n);
      }
      function $u(e) {
        P.lFrame.currentDirectiveIndex = e;
      }
      function Fp() {
        return P.lFrame.currentQueryIndex;
      }
      function Gu(e) {
        P.lFrame.currentQueryIndex = e;
      }
      function jw(e) {
        const n = e[1];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[6] : null;
      }
      function Lp(e, n, t) {
        if (t & F.SkipSelf) {
          let r = n,
            o = e;
          for (
            ;
            !((r = r.parent),
            null !== r ||
              t & F.Host ||
              ((r = jw(o)), null === r || ((o = o[15]), 10 & r.type)));

          );
          if (null === r) return !1;
          (n = r), (e = o);
        }
        const i = (P.lFrame = Vp());
        return (i.currentTNode = n), (i.lView = e), !0;
      }
      function la(e) {
        const n = Vp(),
          t = e[1];
        (P.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function Vp() {
        const e = P.lFrame,
          n = null === e ? null : e.child;
        return null === n ? Bp(e) : n;
      }
      function Bp(e) {
        const n = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = n), n;
      }
      function jp() {
        const e = P.lFrame;
        return (
          (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Hp = jp;
      function ua() {
        const e = jp();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function vt() {
        return P.lFrame.selectedIndex;
      }
      function gi(e) {
        P.lFrame.selectedIndex = e;
      }
      function Oe() {
        const e = P.lFrame;
        return Lu(e.tView, e.selectedIndex);
      }
      function ca(e, n) {
        for (let t = n.directiveStart, i = n.directiveEnd; t < i; t++) {
          const o = e.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = o;
          s && (e.contentHooks || (e.contentHooks = [])).push(-t, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(t, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(t, a)),
            l && (e.viewHooks || (e.viewHooks = [])).push(-t, l),
            u &&
              ((e.viewHooks || (e.viewHooks = [])).push(t, u),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(t, u)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(t, c);
        }
      }
      function da(e, n, t) {
        $p(e, n, 3, t);
      }
      function fa(e, n, t, i) {
        (3 & e[2]) === t && $p(e, n, t, i);
      }
      function Wu(e, n) {
        let t = e[2];
        (3 & t) === n && ((t &= 2047), (t += 1), (e[2] = t));
      }
      function $p(e, n, t, i) {
        const o = null != i ? i : -1,
          s = n.length - 1;
        let a = 0;
        for (let l = void 0 !== i ? 65535 & e[18] : 0; l < s; l++)
          if ("number" == typeof n[l + 1]) {
            if (((a = n[l]), null != i && a >= i)) break;
          } else
            n[l] < 0 && (e[18] += 65536),
              (a < o || -1 == o) &&
                (Jw(e, t, n, l), (e[18] = (4294901760 & e[18]) + l + 2)),
              l++;
      }
      function Jw(e, n, t, i) {
        const r = t[i] < 0,
          o = t[i + 1],
          a = e[r ? -t[i] : t[i]];
        if (r) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === n) {
            e[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class wo {
        constructor(n, t, i) {
          (this.factory = n),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = i);
        }
      }
      function ha(e, n, t) {
        const i = Ie(e);
        let r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const s = t[r++],
              a = t[r++],
              l = t[r++];
            i ? e.setAttribute(n, a, l, s) : n.setAttributeNS(s, a, l);
          } else {
            const s = o,
              a = t[++r];
            Yu(s)
              ? i && e.setProperty(n, s, a)
              : i
              ? e.setAttribute(n, s, a)
              : n.setAttribute(s, a),
              r++;
          }
        }
        return r;
      }
      function Up(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Yu(e) {
        return 64 === e.charCodeAt(0);
      }
      function pa(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let i = 0; i < n.length; i++) {
              const r = n[i];
              "number" == typeof r
                ? (t = r)
                : 0 === t ||
                  Gp(e, t, r, null, -1 === t || 2 === t ? n[++i] : null);
            }
          }
        return e;
      }
      function Gp(e, n, t, i, r) {
        let o = 0,
          s = e.length;
        if (-1 === n) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === n) {
                s = -1;
                break;
              }
              if (a > n) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === i) return void (null !== r && (e[o + 1] = r));
            if (i === e[o + 1]) return void (e[o + 2] = r);
          }
          o++, null !== i && o++, null !== r && o++;
        }
        -1 !== s && (e.splice(s, 0, n), (o = s + 1)),
          e.splice(o++, 0, t),
          null !== i && e.splice(o++, 0, i),
          null !== r && e.splice(o++, 0, r);
      }
      function Wp(e) {
        return -1 !== e;
      }
      function _r(e) {
        return 32767 & e;
      }
      function vr(e, n) {
        let t = (function eE(e) {
            return e >> 16;
          })(e),
          i = n;
        for (; t > 0; ) (i = i[15]), t--;
        return i;
      }
      let qu = !0;
      function ga(e) {
        const n = qu;
        return (qu = e), n;
      }
      let tE = 0;
      function No(e, n) {
        const t = Zu(e, n);
        if (-1 !== t) return t;
        const i = n[1];
        i.firstCreatePass &&
          ((e.injectorIndex = n.length),
          Ju(i.data, e),
          Ju(n, null),
          Ju(i.blueprint, null));
        const r = ma(e, n),
          o = e.injectorIndex;
        if (Wp(r)) {
          const s = _r(r),
            a = vr(r, n),
            l = a[1].data;
          for (let u = 0; u < 8; u++) n[o + u] = a[s + u] | l[s + u];
        }
        return (n[o + 8] = r), o;
      }
      function Ju(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function Zu(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function ma(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let t = 0,
          i = null,
          r = n;
        for (; null !== r; ) {
          const o = r[1],
            s = o.type;
          if (((i = 2 === s ? o.declTNode : 1 === s ? r[6] : null), null === i))
            return -1;
          if ((t++, (r = r[15]), -1 !== i.injectorIndex))
            return i.injectorIndex | (t << 16);
        }
        return -1;
      }
      function _a(e, n, t) {
        !(function nE(e, n, t) {
          let i;
          "string" == typeof t
            ? (i = t.charCodeAt(0) || 0)
            : t.hasOwnProperty(vo) && (i = t[vo]),
            null == i && (i = t[vo] = tE++);
          const r = 255 & i;
          n.data[e + (r >> 5)] |= 1 << r;
        })(e, n, t);
      }
      function qp(e, n, t) {
        if (t & F.Optional) return e;
        Qs(n, "NodeInjector");
      }
      function Jp(e, n, t, i) {
        if (
          (t & F.Optional && void 0 === i && (i = null),
          0 == (t & (F.Self | F.Host)))
        ) {
          const r = e[9],
            o = di(void 0);
          try {
            return r ? r.get(n, i, t & F.Optional) : yp(n, i, t & F.Optional);
          } finally {
            di(o);
          }
        }
        return qp(i, n, t);
      }
      function Zp(e, n, t, i = F.Default, r) {
        if (null !== e) {
          const o = (function sE(e) {
            if ("string" == typeof e) return e.charCodeAt(0) || 0;
            const n = e.hasOwnProperty(vo) ? e[vo] : void 0;
            return "number" == typeof n ? (n >= 0 ? 255 & n : rE) : n;
          })(t);
          if ("function" == typeof o) {
            if (!Lp(n, e, i)) return i & F.Host ? qp(r, t, i) : Jp(n, t, i, r);
            try {
              const s = o(i);
              if (null != s || i & F.Optional) return s;
              Qs(t);
            } finally {
              Hp();
            }
          } else if ("number" == typeof o) {
            let s = null,
              a = Zu(e, n),
              l = -1,
              u = i & F.Host ? n[16][6] : null;
            for (
              (-1 === a || i & F.SkipSelf) &&
              ((l = -1 === a ? ma(e, n) : n[a + 8]),
              -1 !== l && Xp(i, !1)
                ? ((s = n[1]), (a = _r(l)), (n = vr(l, n)))
                : (a = -1));
              -1 !== a;

            ) {
              const c = n[1];
              if (Kp(o, a, c.data)) {
                const d = oE(a, n, t, s, i, u);
                if (d !== Qp) return d;
              }
              (l = n[a + 8]),
                -1 !== l && Xp(i, n[1].data[a + 8] === u) && Kp(o, a, n)
                  ? ((s = c), (a = _r(l)), (n = vr(l, n)))
                  : (a = -1);
            }
          }
        }
        return Jp(n, t, i, r);
      }
      const Qp = {};
      function rE() {
        return new yr(ze(), b());
      }
      function oE(e, n, t, i, r, o) {
        const s = n[1],
          a = s.data[e + 8],
          c = va(
            a,
            s,
            t,
            null == i ? ia(a) && qu : i != s && 0 != (3 & a.type),
            r & F.Host && o === a
          );
        return null !== c ? Mo(n, s, c, a) : Qp;
      }
      function va(e, n, t, i, r) {
        const o = e.providerIndexes,
          s = n.data,
          a = 1048575 & o,
          l = e.directiveStart,
          c = o >> 20,
          f = r ? a + c : e.directiveEnd;
        for (let h = i ? a : a + c; h < f; h++) {
          const p = s[h];
          if ((h < l && t === p) || (h >= l && p.type === t)) return h;
        }
        if (r) {
          const h = s[l];
          if (h && ln(h) && h.type === t) return l;
        }
        return null;
      }
      function Mo(e, n, t, i) {
        let r = e[t];
        const o = n.data;
        if (
          (function Zw(e) {
            return e instanceof wo;
          })(r)
        ) {
          const s = r;
          s.resolving &&
            (function KC(e, n) {
              const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
              throw new X(
                -200,
                `Circular dependency in DI detected for ${e}${t}`
              );
            })(pt(o[t]));
          const a = ga(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? di(s.injectImpl) : null;
          Lp(e, i, F.Default);
          try {
            (r = e[t] = s.factory(void 0, o, e, i)),
              n.firstCreatePass &&
                t >= i.directiveStart &&
                (function qw(e, n, t) {
                  const {
                    ngOnChanges: i,
                    ngOnInit: r,
                    ngDoCheck: o,
                  } = n.type.prototype;
                  if (i) {
                    const s = Mp(n);
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(e, s),
                      (
                        t.preOrderCheckHooks || (t.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  r &&
                    (t.preOrderHooks || (t.preOrderHooks = [])).push(0 - e, r),
                    o &&
                      ((t.preOrderHooks || (t.preOrderHooks = [])).push(e, o),
                      (
                        t.preOrderCheckHooks || (t.preOrderCheckHooks = [])
                      ).push(e, o));
                })(t, o[t], n);
          } finally {
            null !== l && di(l), ga(a), (s.resolving = !1), Hp();
          }
        }
        return r;
      }
      function Kp(e, n, t) {
        return !!(t[n + (e >> 5)] & (1 << e));
      }
      function Xp(e, n) {
        return !(e & F.Self || (e & F.Host && n));
      }
      class yr {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, i) {
          return Zp(this._tNode, this._lView, n, i, t);
        }
      }
      const Dr = "__parameters__";
      function wr(e, n, t) {
        return fi(() => {
          const i = (function Ku(e) {
            return function (...t) {
              if (e) {
                const i = e(...t);
                for (const r in i) this[r] = i[r];
              }
            };
          })(n);
          function r(...o) {
            if (this instanceof r) return i.apply(this, o), this;
            const s = new r(...o);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Dr)
                ? l[Dr]
                : Object.defineProperty(l, Dr, { value: [] })[Dr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            t && (r.prototype = Object.create(t.prototype)),
            (r.prototype.ngMetadataName = e),
            (r.annotationCls = r),
            r
          );
        });
      }
      class W {
        constructor(n, t) {
          (this._desc = n),
            (this.ngMetadataName = "InjectionToken"),
            (this.??prov = void 0),
            "number" == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.??prov = x({
                  token: this,
                  providedIn: t.providedIn || "root",
                  factory: t.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const lE = new W("AnalyzeForEntryComponents");
      function Jt(e, n) {
        void 0 === n && (n = e);
        for (let t = 0; t < e.length; t++) {
          let i = e[t];
          Array.isArray(i)
            ? (n === e && (n = e.slice(0, t)), Jt(i, n))
            : n !== e && n.push(i);
        }
        return n;
      }
      function Sn(e, n) {
        e.forEach((t) => (Array.isArray(t) ? Sn(t, n) : n(t)));
      }
      function tg(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function ya(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function Ao(e, n) {
        const t = [];
        for (let i = 0; i < e; i++) t.push(n);
        return t;
      }
      function Ft(e, n, t) {
        let i = Er(e, n);
        return (
          i >= 0
            ? (e[1 | i] = t)
            : ((i = ~i),
              (function dE(e, n, t, i) {
                let r = e.length;
                if (r == n) e.push(t, i);
                else if (1 === r) e.push(i, e[0]), (e[0] = t);
                else {
                  for (r--, e.push(e[r - 1], e[r]); r > n; )
                    (e[r] = e[r - 2]), r--;
                  (e[n] = t), (e[n + 1] = i);
                }
              })(e, i, n, t)),
          i
        );
      }
      function ec(e, n) {
        const t = Er(e, n);
        if (t >= 0) return e[1 | t];
      }
      function Er(e, n) {
        return (function rg(e, n, t) {
          let i = 0,
            r = e.length >> t;
          for (; r !== i; ) {
            const o = i + ((r - i) >> 1),
              s = e[o << t];
            if (n === s) return o << t;
            s > n ? (r = o) : (i = o + 1);
          }
          return ~(r << t);
        })(e, n, 1);
      }
      const Io = {},
        nc = "__NG_DI_FLAG__",
        Da = "ngTempTokenPath",
        vE = /\n/gm,
        sg = "__source",
        bE = fe({ provide: String, useValue: fe });
      let Oo;
      function ag(e) {
        const n = Oo;
        return (Oo = e), n;
      }
      function DE(e, n = F.Default) {
        if (void 0 === Oo) throw new X(203, "");
        return null === Oo
          ? yp(e, void 0, n)
          : Oo.get(e, n & F.Optional ? null : void 0, n);
      }
      function T(e, n = F.Default) {
        return (
          (function ow() {
            return Nu;
          })() || DE
        )(j(e), n);
      }
      const CE = T;
      function ic(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const i = j(e[t]);
          if (Array.isArray(i)) {
            if (0 === i.length) throw new X(900, "");
            let r,
              o = F.Default;
            for (let s = 0; s < i.length; s++) {
              const a = i[s],
                l = wE(a);
              "number" == typeof l
                ? -1 === l
                  ? (r = a.token)
                  : (o |= l)
                : (r = a);
            }
            n.push(T(r, o));
          } else n.push(T(i));
        }
        return n;
      }
      function Ro(e, n) {
        return (e[nc] = n), (e.prototype[nc] = n), e;
      }
      function wE(e) {
        return e[nc];
      }
      const Ca = Ro(
          wr("Inject", (e) => ({ token: e })),
          -1
        ),
        _i = Ro(wr("Optional"), 8),
        xo = Ro(wr("SkipSelf"), 4);
      let Ea;
      function Mr(e) {
        var n;
        return (
          (null ===
            (n = (function oc() {
              if (void 0 === Ea && ((Ea = null), ue.trustedTypes))
                try {
                  Ea = ue.trustedTypes.createPolicy("angular", {
                    createHTML: (e) => e,
                    createScript: (e) => e,
                    createScriptURL: (e) => e,
                  });
                } catch (e) {}
              return Ea;
            })()) || void 0 === n
            ? void 0
            : n.createHTML(e)) || e
        );
      }
      class mg {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function vi(e) {
        return e instanceof mg ? e.changingThisBreaksApplicationSecurity : e;
      }
      class $E {
        constructor(n) {
          this.inertDocumentHelper = n;
        }
        getInertBodyElement(n) {
          n = "<body><remove></remove>" + n;
          try {
            const t = new window.DOMParser().parseFromString(
              Mr(n),
              "text/html"
            ).body;
            return null === t
              ? this.inertDocumentHelper.getInertBodyElement(n)
              : (t.removeChild(t.firstChild), t);
          } catch (t) {
            return null;
          }
        }
      }
      class UE {
        constructor(n) {
          if (
            ((this.defaultDoc = n),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert"
              )),
            null == this.inertDocument.body)
          ) {
            const t = this.inertDocument.createElement("html");
            this.inertDocument.appendChild(t);
            const i = this.inertDocument.createElement("body");
            t.appendChild(i);
          }
        }
        getInertBodyElement(n) {
          const t = this.inertDocument.createElement("template");
          if ("content" in t) return (t.innerHTML = Mr(n)), t;
          const i = this.inertDocument.createElement("body");
          return (
            (i.innerHTML = Mr(n)),
            this.defaultDoc.documentMode && this.stripCustomNsAttrs(i),
            i
          );
        }
        stripCustomNsAttrs(n) {
          const t = n.attributes;
          for (let r = t.length - 1; 0 < r; r--) {
            const s = t.item(r).name;
            ("xmlns:ns1" === s || 0 === s.indexOf("ns1:")) &&
              n.removeAttribute(s);
          }
          let i = n.firstChild;
          for (; i; )
            i.nodeType === Node.ELEMENT_NODE && this.stripCustomNsAttrs(i),
              (i = i.nextSibling);
        }
      }
      const WE =
          /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        zE =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      function Ma(e) {
        return (e = String(e)).match(WE) || e.match(zE) ? e : "unsafe:" + e;
      }
      function vg(e) {
        return (e = String(e))
          .split(",")
          .map((n) => Ma(n.trim()))
          .join(", ");
      }
      function An(e) {
        const n = {};
        for (const t of e.split(",")) n[t] = !0;
        return n;
      }
      function Fo(...e) {
        const n = {};
        for (const t of e)
          for (const i in t) t.hasOwnProperty(i) && (n[i] = !0);
        return n;
      }
      const yg = An("area,br,col,hr,img,wbr"),
        bg = An("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        Dg = An("rp,rt"),
        ac = Fo(
          yg,
          Fo(
            bg,
            An(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
            )
          ),
          Fo(
            Dg,
            An(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
            )
          ),
          Fo(Dg, bg)
        ),
        lc = An("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        uc = An("srcset"),
        Cg = Fo(
          lc,
          uc,
          An(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
          ),
          An(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
          )
        );
      var $e = (() => (
        (($e = $e || {})[($e.NONE = 0)] = "NONE"),
        ($e[($e.HTML = 1)] = "HTML"),
        ($e[($e.STYLE = 2)] = "STYLE"),
        ($e[($e.SCRIPT = 3)] = "SCRIPT"),
        ($e[($e.URL = 4)] = "URL"),
        ($e[($e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        $e
      ))();
      function Lt(e) {
        const n = (function Lo() {
          const e = b();
          return e && e[12];
        })();
        return n
          ? n.sanitize($e.URL, e) || ""
          : (function ko(e, n) {
              const t = (function HE(e) {
                return (e instanceof mg && e.getTypeName()) || null;
              })(e);
              if (null != t && t !== n) {
                if ("ResourceURL" === t && "URL" === n) return !0;
                throw new Error(
                  `Required a safe ${n}, got a ${t} (see https://g.co/ng/security#xss)`
                );
              }
              return t === n;
            })(e, "URL")
          ? vi(e)
          : Ma(L(e));
      }
      const Mg = "__ngContext__";
      function dt(e, n) {
        e[Mg] = n;
      }
      function fc(e) {
        const n = (function Vo(e) {
          return e[Mg] || null;
        })(e);
        return n ? (Array.isArray(n) ? n : n.lView) : null;
      }
      function pc(e) {
        return e.ngOriginalError;
      }
      function gN(e, ...n) {
        e.error(...n);
      }
      class Bo {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n),
            i = (function pN(e) {
              return (e && e.ngErrorLogger) || gN;
            })(n);
          i(this._console, "ERROR", n),
            t && i(this._console, "ORIGINAL ERROR", t);
        }
        _findOriginalError(n) {
          let t = n && pc(n);
          for (; t && pc(t); ) t = pc(t);
          return t || null;
        }
      }
      const vN = /^>|^->|<!--|-->|--!>|<!-$/g,
        yN = /(<|>)/;
      const NN = (() =>
        (
          ("undefined" != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(ue))();
      function In(e) {
        return e instanceof Function ? e() : e;
      }
      var Vt = (() => (
        ((Vt = Vt || {})[(Vt.Important = 1)] = "Important"),
        (Vt[(Vt.DashCase = 2)] = "DashCase"),
        Vt
      ))();
      let gc;
      function mc(e, n) {
        return gc(e, n);
      }
      function jo(e) {
        const n = e[3];
        return an(n) ? n[3] : n;
      }
      function _c(e) {
        return kg(e[13]);
      }
      function vc(e) {
        return kg(e[4]);
      }
      function kg(e) {
        for (; null !== e && !an(e); ) e = e[4];
        return e;
      }
      function Sr(e, n, t, i, r) {
        if (null != i) {
          let o,
            s = !1;
          an(i) ? (o = i) : Mn(i) && ((s = !0), (i = i[0]));
          const a = He(i);
          0 === e && null !== t
            ? null == r
              ? Hg(n, t, a)
              : ji(n, t, a, r || null, !0)
            : 1 === e && null !== t
            ? ji(n, t, a, r || null, !0)
            : 2 === e
            ? qg(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != o &&
              (function $N(e, n, t, i, r) {
                const o = t[7];
                o !== He(t) && Sr(n, e, i, o, r);
                for (let a = 10; a < t.length; a++) {
                  const l = t[a];
                  Ho(l[1], l, e, n, i, o);
                }
              })(n, e, o, t, r);
        }
      }
      function yc(e, n) {
        return Ie(e) ? e.createText(n) : e.createTextNode(n);
      }
      function Fg(e, n, t) {
        Ie(e) ? e.setValue(n, t) : (n.textContent = t);
      }
      function IN(e, n) {
        return e.createComment(
          (function Ig(e) {
            return e.replace(vN, (n) => n.replace(yN, "\u200b$1\u200b"));
          })(n)
        );
      }
      function bc(e, n, t) {
        if (Ie(e)) return e.createElement(n, t);
        {
          const i =
            null !== t
              ? (function Nw(e) {
                  const n = e.toLowerCase();
                  return "svg" === n
                    ? "http://www.w3.org/2000/svg"
                    : "math" === n
                    ? "http://www.w3.org/1998/MathML/"
                    : null;
                })(t)
              : null;
          return null === i ? e.createElement(n) : e.createElementNS(i, n);
        }
      }
      function Lg(e, n) {
        const t = e[9],
          i = t.indexOf(n),
          r = n[3];
        1024 & n[2] && ((n[2] &= -1025), Bu(r, -1)), t.splice(i, 1);
      }
      function Dc(e, n) {
        if (e.length <= 10) return;
        const t = 10 + n,
          i = e[t];
        if (i) {
          const r = i[17];
          null !== r && r !== e && Lg(r, i), n > 0 && (e[t - 1][4] = i[4]);
          const o = ya(e, 10 + n);
          !(function ON(e, n) {
            Ho(e, n, n[H], 2, null, null), (n[0] = null), (n[6] = null);
          })(i[1], i);
          const s = o[19];
          null !== s && s.detachView(o[1]),
            (i[3] = null),
            (i[4] = null),
            (i[2] &= -129);
        }
        return i;
      }
      function Vg(e, n) {
        if (!(256 & n[2])) {
          const t = n[H];
          Ie(t) && t.destroyNode && Ho(e, n, t, 3, null, null),
            (function PN(e) {
              let n = e[13];
              if (!n) return Cc(e[1], e);
              for (; n; ) {
                let t = null;
                if (Mn(n)) t = n[13];
                else {
                  const i = n[10];
                  i && (t = i);
                }
                if (!t) {
                  for (; n && !n[4] && n !== e; )
                    Mn(n) && Cc(n[1], n), (n = n[3]);
                  null === n && (n = e), Mn(n) && Cc(n[1], n), (t = n && n[4]);
                }
                n = t;
              }
            })(n);
        }
      }
      function Cc(e, n) {
        if (!(256 & n[2])) {
          (n[2] &= -129),
            (n[2] |= 256),
            (function VN(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let i = 0; i < t.length; i += 2) {
                  const r = n[t[i]];
                  if (!(r instanceof wo)) {
                    const o = t[i + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = r[o[s]],
                          l = o[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(r);
                      } finally {
                      }
                  }
                }
            })(e, n),
            (function LN(e, n) {
              const t = e.cleanup,
                i = n[7];
              let r = -1;
              if (null !== t)
                for (let o = 0; o < t.length - 1; o += 2)
                  if ("string" == typeof t[o]) {
                    const s = t[o + 1],
                      a = "function" == typeof s ? s(n) : He(n[s]),
                      l = i[(r = t[o + 2])],
                      u = t[o + 3];
                    "boolean" == typeof u
                      ? a.removeEventListener(t[o], l, u)
                      : u >= 0
                      ? i[(r = u)]()
                      : i[(r = -u)].unsubscribe(),
                      (o += 2);
                  } else {
                    const s = i[(r = t[o + 1])];
                    t[o].call(s);
                  }
              if (null !== i) {
                for (let o = r + 1; o < i.length; o++) i[o]();
                n[7] = null;
              }
            })(e, n),
            1 === n[1].type && Ie(n[H]) && n[H].destroy();
          const t = n[17];
          if (null !== t && an(n[3])) {
            t !== n[3] && Lg(t, n);
            const i = n[19];
            null !== i && i.detachView(e);
          }
        }
      }
      function Bg(e, n, t) {
        return jg(e, n.parent, t);
      }
      function jg(e, n, t) {
        let i = n;
        for (; null !== i && 40 & i.type; ) i = (n = i).parent;
        if (null === i) return t[0];
        if (2 & i.flags) {
          const r = e.data[i.directiveStart].encapsulation;
          if (r === Nn.None || r === Nn.Emulated) return null;
        }
        return qt(i, t);
      }
      function ji(e, n, t, i, r) {
        Ie(e) ? e.insertBefore(n, t, i, r) : n.insertBefore(t, i, r);
      }
      function Hg(e, n, t) {
        Ie(e) ? e.appendChild(n, t) : n.appendChild(t);
      }
      function $g(e, n, t, i, r) {
        null !== i ? ji(e, n, t, i, r) : Hg(e, n, t);
      }
      function Sa(e, n) {
        return Ie(e) ? e.parentNode(n) : n.parentNode;
      }
      function Ug(e, n, t) {
        return Wg(e, n, t);
      }
      function Gg(e, n, t) {
        return 40 & e.type ? qt(e, t) : null;
      }
      let wc,
        Wg = Gg;
      function zg(e, n) {
        (Wg = e), (wc = n);
      }
      function Aa(e, n, t, i) {
        const r = Bg(e, i, n),
          o = n[H],
          a = Ug(i.parent || n[6], i, n);
        if (null != r)
          if (Array.isArray(t))
            for (let l = 0; l < t.length; l++) $g(o, r, t[l], a, !1);
          else $g(o, r, t, a, !1);
        void 0 !== wc && wc(o, i, n, t, r);
      }
      function Ia(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return qt(n, e);
          if (4 & t) return Ec(-1, e[n.index]);
          if (8 & t) {
            const i = n.child;
            if (null !== i) return Ia(e, i);
            {
              const r = e[n.index];
              return an(r) ? Ec(-1, r) : He(r);
            }
          }
          if (32 & t) return mc(n, e)() || He(e[n.index]);
          {
            const i = Yg(e, n);
            return null !== i
              ? Array.isArray(i)
                ? i[0]
                : Ia(jo(e[16]), i)
              : Ia(e, n.next);
          }
        }
        return null;
      }
      function Yg(e, n) {
        return null !== n ? e[16][6].projection[n.projection] : null;
      }
      function Ec(e, n) {
        const t = 10 + e + 1;
        if (t < n.length) {
          const i = n[t],
            r = i[1].firstChild;
          if (null !== r) return Ia(i, r);
        }
        return n[7];
      }
      function qg(e, n, t) {
        const i = Sa(e, n);
        i &&
          (function BN(e, n, t, i) {
            Ie(e) ? e.removeChild(n, t, i) : n.removeChild(t);
          })(e, i, n, t);
      }
      function Nc(e, n, t, i, r, o, s) {
        for (; null != t; ) {
          const a = i[t.index],
            l = t.type;
          if (
            (s && 0 === n && (a && dt(He(a), i), (t.flags |= 4)),
            64 != (64 & t.flags))
          )
            if (8 & l) Nc(e, n, t.child, i, r, o, !1), Sr(n, e, r, a, o);
            else if (32 & l) {
              const u = mc(t, i);
              let c;
              for (; (c = u()); ) Sr(n, e, r, c, o);
              Sr(n, e, r, a, o);
            } else 16 & l ? Jg(e, n, i, t, r, o) : Sr(n, e, r, a, o);
          t = s ? t.projectionNext : t.next;
        }
      }
      function Ho(e, n, t, i, r, o) {
        Nc(t, i, e.firstChild, n, r, o, !1);
      }
      function Jg(e, n, t, i, r, o) {
        const s = t[16],
          l = s[6].projection[i.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Sr(n, e, r, l[u], o);
        else Nc(e, n, l, s[3], r, o, !0);
      }
      function Zg(e, n, t) {
        Ie(e) ? e.setAttribute(n, "style", t) : (n.style.cssText = t);
      }
      function Mc(e, n, t) {
        Ie(e)
          ? "" === t
            ? e.removeAttribute(n, "class")
            : e.setAttribute(n, "class", t)
          : (n.className = t);
      }
      function Qg(e, n, t) {
        let i = e.length;
        for (;;) {
          const r = e.indexOf(n, t);
          if (-1 === r) return r;
          if (0 === r || e.charCodeAt(r - 1) <= 32) {
            const o = n.length;
            if (r + o === i || e.charCodeAt(r + o) <= 32) return r;
          }
          t = r + 1;
        }
      }
      const Kg = "ng-template";
      function GN(e, n, t) {
        let i = 0;
        for (; i < e.length; ) {
          let r = e[i++];
          if (t && "class" === r) {
            if (((r = e[i]), -1 !== Qg(r.toLowerCase(), n, 0))) return !0;
          } else if (1 === r) {
            for (; i < e.length && "string" == typeof (r = e[i++]); )
              if (r.toLowerCase() === n) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Xg(e) {
        return 4 === e.type && e.value !== Kg;
      }
      function WN(e, n, t) {
        return n === (4 !== e.type || t ? e.value : Kg);
      }
      function zN(e, n, t) {
        let i = 4;
        const r = e.attrs || [],
          o = (function JN(e) {
            for (let n = 0; n < e.length; n++) if (Up(e[n])) return n;
            return e.length;
          })(r);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & i) {
                if (
                  ((i = 2 | (1 & i)),
                  ("" !== l && !WN(e, l, t)) || ("" === l && 1 === n.length))
                ) {
                  if (un(i)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & i ? l : n[++a];
                if (8 & i && null !== e.attrs) {
                  if (!GN(e.attrs, u, t)) {
                    if (un(i)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = YN(8 & i ? "class" : l, r, Xg(e), t);
                if (-1 === d) {
                  if (un(i)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > o ? "" : r[d + 1].toLowerCase();
                  const h = 8 & i ? f : null;
                  if ((h && -1 !== Qg(h, u, 0)) || (2 & i && u !== f)) {
                    if (un(i)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !un(i) && !un(l)) return !1;
            if (s && un(l)) continue;
            (s = !1), (i = l | (1 & i));
          }
        }
        return un(i) || s;
      }
      function un(e) {
        return 0 == (1 & e);
      }
      function YN(e, n, t, i) {
        if (null === n) return -1;
        let r = 0;
        if (i || !t) {
          let o = !1;
          for (; r < n.length; ) {
            const s = n[r];
            if (s === e) return r;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++r];
                for (; "string" == typeof a; ) a = n[++r];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                r += 4;
                continue;
              }
            }
            r += o ? 1 : 2;
          }
          return -1;
        }
        return (function ZN(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const i = e[t];
              if ("number" == typeof i) return -1;
              if (i === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function em(e, n, t = !1) {
        for (let i = 0; i < n.length; i++) if (zN(e, n[i], t)) return !0;
        return !1;
      }
      function QN(e, n) {
        e: for (let t = 0; t < n.length; t++) {
          const i = n[t];
          if (e.length === i.length) {
            for (let r = 0; r < e.length; r++) if (e[r] !== i[r]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function tm(e, n) {
        return e ? ":not(" + n.trim() + ")" : n;
      }
      function KN(e) {
        let n = e[0],
          t = 1,
          i = 2,
          r = "",
          o = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ("string" == typeof s)
            if (2 & i) {
              const a = e[++t];
              r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & i ? (r += "." + s) : 4 & i && (r += " " + s);
          else
            "" !== r && !un(s) && ((n += tm(o, r)), (r = "")),
              (i = s),
              (o = o || !un(i));
          t++;
        }
        return "" !== r && (n += tm(o, r)), n;
      }
      const V = {};
      function S(e) {
        nm(ee(), b(), vt() + e, sa());
      }
      function nm(e, n, t, i) {
        if (!i)
          if (3 == (3 & n[2])) {
            const o = e.preOrderCheckHooks;
            null !== o && da(n, o, t);
          } else {
            const o = e.preOrderHooks;
            null !== o && fa(n, o, 0, t);
          }
        gi(t);
      }
      function Oa(e, n) {
        return (e << 17) | (n << 2);
      }
      function cn(e) {
        return (e >> 17) & 32767;
      }
      function Tc(e) {
        return 2 | e;
      }
      function Jn(e) {
        return (131068 & e) >> 2;
      }
      function Sc(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function Ac(e) {
        return 1 | e;
      }
      function hm(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let i = 0; i < t.length; i += 2) {
            const r = t[i],
              o = t[i + 1];
            if (-1 !== o) {
              const s = e.data[o];
              Gu(r), s.contentQueries(2, n[o], o);
            }
          }
      }
      function $o(e, n, t, i, r, o, s, a, l, u) {
        const c = n.blueprint.slice();
        return (
          (c[0] = r),
          (c[2] = 140 | i),
          Op(c),
          (c[3] = c[15] = e),
          (c[8] = t),
          (c[10] = s || (e && e[10])),
          (c[H] = a || (e && e[H])),
          (c[12] = l || (e && e[12]) || null),
          (c[9] = u || (e && e[9]) || null),
          (c[6] = o),
          (c[16] = 2 == n.type ? e[16] : c),
          c
        );
      }
      function Ar(e, n, t, i, r) {
        let o = e.data[n];
        if (null === o)
          (o = Vc(e, n, t, i, r)),
            (function Lw() {
              return P.lFrame.inI18n;
            })() && (o.flags |= 64);
        else if (64 & o.type) {
          (o.type = t), (o.value = i), (o.attrs = r);
          const s = Co();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Tn(o, !0), o;
      }
      function Vc(e, n, t, i, r) {
        const o = xp(),
          s = ju(),
          l = (e.data[n] = (function mM(e, n, t, i, r, o) {
            return {
              type: t,
              index: i,
              insertBeforeIndex: null,
              injectorIndex: n ? n.injectorIndex : -1,
              directiveStart: -1,
              directiveEnd: -1,
              directiveStylingLast: -1,
              propertyBindings: null,
              flags: 0,
              providerIndexes: 0,
              value: r,
              attrs: o,
              mergedAttrs: null,
              localNames: null,
              initialInputs: void 0,
              inputs: null,
              outputs: null,
              tViews: null,
              next: null,
              projectionNext: null,
              child: null,
              parent: n,
              projection: null,
              styles: null,
              stylesWithoutHost: null,
              residualStyles: void 0,
              classes: null,
              classesWithoutHost: null,
              residualClasses: void 0,
              classBindings: 0,
              styleBindings: 0,
            };
          })(0, s ? o : o && o.parent, t, n, i, r));
        return (
          null === e.firstChild && (e.firstChild = l),
          null !== o &&
            (s
              ? null == o.child && null !== l.parent && (o.child = l)
              : null === o.next && (o.next = l)),
          l
        );
      }
      function Ir(e, n, t, i) {
        if (0 === t) return -1;
        const r = n.length;
        for (let o = 0; o < t; o++)
          n.push(i), e.blueprint.push(i), e.data.push(null);
        return r;
      }
      function Uo(e, n, t) {
        la(n);
        try {
          const i = e.viewQuery;
          null !== i && Yc(1, i, t);
          const r = e.template;
          null !== r && pm(e, n, r, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && hm(e, n),
            e.staticViewQueries && Yc(2, e.viewQuery, t);
          const o = e.components;
          null !== o &&
            (function hM(e, n) {
              for (let t = 0; t < n.length; t++) PM(e, n[t]);
            })(n, o);
        } catch (i) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            i)
          );
        } finally {
          (n[2] &= -5), ua();
        }
      }
      function Or(e, n, t, i) {
        const r = n[2];
        if (256 == (256 & r)) return;
        la(n);
        const o = sa();
        try {
          Op(n),
            (function Pp(e) {
              return (P.lFrame.bindingIndex = e);
            })(e.bindingStartIndex),
            null !== t && pm(e, n, t, 2, i);
          const s = 3 == (3 & r);
          if (!o)
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && da(n, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && fa(n, u, 0, null), Wu(n, 0);
            }
          if (
            ((function RM(e) {
              for (let n = _c(e); null !== n; n = vc(n)) {
                if (!n[2]) continue;
                const t = n[9];
                for (let i = 0; i < t.length; i++) {
                  const r = t[i],
                    o = r[3];
                  0 == (1024 & r[2]) && Bu(o, 1), (r[2] |= 1024);
                }
              }
            })(n),
            (function OM(e) {
              for (let n = _c(e); null !== n; n = vc(n))
                for (let t = 10; t < n.length; t++) {
                  const i = n[t],
                    r = i[1];
                  Vu(i) && Or(r, i, r.template, i[8]);
                }
            })(n),
            null !== e.contentQueries && hm(e, n),
            !o)
          )
            if (s) {
              const u = e.contentCheckHooks;
              null !== u && da(n, u);
            } else {
              const u = e.contentHooks;
              null !== u && fa(n, u, 1), Wu(n, 1);
            }
          !(function dM(e, n) {
            const t = e.hostBindingOpCodes;
            if (null !== t)
              try {
                for (let i = 0; i < t.length; i++) {
                  const r = t[i];
                  if (r < 0) gi(~r);
                  else {
                    const o = r,
                      s = t[++i],
                      a = t[++i];
                    Vw(s, o), a(2, n[o]);
                  }
                }
              } finally {
                gi(-1);
              }
          })(e, n);
          const a = e.components;
          null !== a &&
            (function fM(e, n) {
              for (let t = 0; t < n.length; t++) xM(e, n[t]);
            })(n, a);
          const l = e.viewQuery;
          if ((null !== l && Yc(2, l, i), !o))
            if (s) {
              const u = e.viewCheckHooks;
              null !== u && da(n, u);
            } else {
              const u = e.viewHooks;
              null !== u && fa(n, u, 2), Wu(n, 2);
            }
          !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
            o || (n[2] &= -73),
            1024 & n[2] && ((n[2] &= -1025), Bu(n[3], -1));
        } finally {
          ua();
        }
      }
      function pM(e, n, t, i) {
        const r = n[10],
          o = !sa(),
          s = Ip(n);
        try {
          o && !s && r.begin && r.begin(), s && Uo(e, n, i), Or(e, n, t, i);
        } finally {
          o && !s && r.end && r.end();
        }
      }
      function pm(e, n, t, i, r) {
        const o = vt(),
          s = 2 & i;
        try {
          gi(-1), s && n.length > 20 && nm(e, n, 20, sa()), t(i, r);
        } finally {
          gi(o);
        }
      }
      function Bc(e, n, t) {
        !Rp() ||
          ((function wM(e, n, t, i) {
            const r = t.directiveStart,
              o = t.directiveEnd;
            e.firstCreatePass || No(t, n), dt(i, n);
            const s = t.initialInputs;
            for (let a = r; a < o; a++) {
              const l = e.data[a],
                u = ln(l);
              u && SM(n, t, l);
              const c = Mo(n, e, a, t);
              dt(c, n),
                null !== s && AM(0, a - r, c, l, 0, s),
                u && (kt(t.index, n)[8] = c);
            }
          })(e, n, t, qt(t, n)),
          128 == (128 & t.flags) &&
            (function EM(e, n, t) {
              const i = t.directiveStart,
                r = t.directiveEnd,
                s = t.index,
                a = (function Bw() {
                  return P.lFrame.currentDirectiveIndex;
                })();
              try {
                gi(s);
                for (let l = i; l < r; l++) {
                  const u = e.data[l],
                    c = n[l];
                  $u(l),
                    (null !== u.hostBindings ||
                      0 !== u.hostVars ||
                      null !== u.hostAttrs) &&
                      wm(u, c);
                }
              } finally {
                gi(-1), $u(a);
              }
            })(e, n, t));
      }
      function jc(e, n, t = qt) {
        const i = n.localNames;
        if (null !== i) {
          let r = n.index + 1;
          for (let o = 0; o < i.length; o += 2) {
            const s = i[o + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[r++] = a;
          }
        }
      }
      function mm(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = Pa(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : n;
      }
      function Pa(e, n, t, i, r, o, s, a, l, u) {
        const c = 20 + i,
          d = c + r,
          f = (function gM(e, n) {
            const t = [];
            for (let i = 0; i < n; i++) t.push(i < e ? null : V);
            return t;
          })(c, d),
          h = "function" == typeof u ? u() : u;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: n,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function ym(e, n, t, i) {
        const r = (function Am(e) {
          return e[7] || (e[7] = []);
        })(n);
        null === t
          ? r.push(i)
          : (r.push(t),
            e.firstCreatePass &&
              (function Im(e) {
                return e.cleanup || (e.cleanup = []);
              })(e).push(i, r.length - 1));
      }
      function bm(e, n, t) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            const r = e[i];
            (t = null === t ? {} : t).hasOwnProperty(i)
              ? t[i].push(n, r)
              : (t[i] = [n, r]);
          }
        return t;
      }
      function Bt(e, n, t, i, r, o, s, a) {
        const l = qt(n, t);
        let c,
          u = n.inputs;
        !a && null != u && (c = u[i])
          ? (xm(e, t, c, i, r),
            ia(n) &&
              (function yM(e, n) {
                const t = kt(n, e);
                16 & t[2] || (t[2] |= 64);
              })(t, n.index))
          : 3 & n.type &&
            ((i = (function vM(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(i)),
            (r = null != s ? s(r, n.value || "", i) : r),
            Ie(o)
              ? o.setProperty(l, i, r)
              : Yu(i) || (l.setProperty ? l.setProperty(i, r) : (l[i] = r)));
      }
      function Hc(e, n, t, i) {
        let r = !1;
        if (Rp()) {
          const o = (function NM(e, n, t) {
              const i = e.directiveRegistry;
              let r = null;
              if (i)
                for (let o = 0; o < i.length; o++) {
                  const s = i[o];
                  em(t, s.selectors, !1) &&
                    (r || (r = []),
                    _a(No(t, n), e, s.type),
                    ln(s) ? (Em(e, t), r.unshift(s)) : r.push(s));
                }
              return r;
            })(e, n, t),
            s = null === i ? null : { "": -1 };
          if (null !== o) {
            (r = !0), Nm(t, e.data.length, o.length);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              u = Ir(e, n, o.length, null);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              (t.mergedAttrs = pa(t.mergedAttrs, d.hostAttrs)),
                Mm(e, t, n, u, d),
                TM(u, d, s),
                null !== d.contentQueries && (t.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (t.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(t.index),
                (a = !0)),
                !l &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                    t.index
                  ),
                  (l = !0)),
                u++;
            }
            !(function _M(e, n) {
              const i = n.directiveEnd,
                r = e.data,
                o = n.attrs,
                s = [];
              let a = null,
                l = null;
              for (let u = n.directiveStart; u < i; u++) {
                const c = r[u],
                  d = c.inputs,
                  f = null === o || Xg(n) ? null : IM(d, o);
                s.push(f), (a = bm(d, u, a)), (l = bm(c.outputs, u, l));
              }
              null !== a &&
                (a.hasOwnProperty("class") && (n.flags |= 16),
                a.hasOwnProperty("style") && (n.flags |= 32)),
                (n.initialInputs = s),
                (n.inputs = a),
                (n.outputs = l);
            })(e, t);
          }
          s &&
            (function MM(e, n, t) {
              if (n) {
                const i = (e.localNames = []);
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r + 1]];
                  if (null == o) throw new X(-301, !1);
                  i.push(n[r], o);
                }
              }
            })(t, i, s);
        }
        return (t.mergedAttrs = pa(t.mergedAttrs, t.attrs)), r;
      }
      function Cm(e, n, t, i, r, o) {
        const s = o.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const l = ~n.index;
          (function CM(e) {
            let n = e.length;
            for (; n > 0; ) {
              const t = e[--n];
              if ("number" == typeof t && t < 0) return t;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(i, r, s);
        }
      }
      function wm(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function Em(e, n) {
        (n.flags |= 2), (e.components || (e.components = [])).push(n.index);
      }
      function TM(e, n, t) {
        if (t) {
          if (n.exportAs)
            for (let i = 0; i < n.exportAs.length; i++) t[n.exportAs[i]] = e;
          ln(n) && (t[""] = e);
        }
      }
      function Nm(e, n, t) {
        (e.flags |= 1),
          (e.directiveStart = n),
          (e.directiveEnd = n + t),
          (e.providerIndexes = n);
      }
      function Mm(e, n, t, i, r) {
        e.data[i] = r;
        const o = r.factory || (r.factory = Vi(r.type)),
          s = new wo(o, ln(r), null);
        (e.blueprint[i] = s),
          (t[i] = s),
          Cm(e, n, 0, i, Ir(e, t, r.hostVars, V), r);
      }
      function SM(e, n, t) {
        const i = qt(n, e),
          r = mm(t),
          o = e[10],
          s = ka(
            e,
            $o(
              e,
              r,
              null,
              t.onPush ? 64 : 16,
              i,
              n,
              o,
              o.createRenderer(i, t),
              null,
              null
            )
          );
        e[n.index] = s;
      }
      function $c(e, n, t, i, r, o, s) {
        if (null == o)
          Ie(e) ? e.removeAttribute(n, r, t) : n.removeAttribute(r);
        else {
          const a = null == s ? L(o) : s(o, i || "", r);
          Ie(e)
            ? e.setAttribute(n, r, a, t)
            : t
            ? n.setAttributeNS(t, r, a)
            : n.setAttribute(r, a);
        }
      }
      function AM(e, n, t, i, r, o) {
        const s = o[n];
        if (null !== s) {
          const a = i.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? i.setInput(t, d, u, c) : (t[c] = d);
          }
        }
      }
      function IM(e, n) {
        let t = null,
          i = 0;
        for (; i < n.length; ) {
          const r = n[i];
          if (0 !== r)
            if (5 !== r) {
              if ("number" == typeof r) break;
              e.hasOwnProperty(r) &&
                (null === t && (t = []), t.push(r, e[r], n[i + 1])),
                (i += 2);
            } else i += 2;
          else i += 4;
        }
        return t;
      }
      function Tm(e, n, t, i) {
        return new Array(e, !0, !1, n, null, 0, i, t, null, null);
      }
      function xM(e, n) {
        const t = kt(n, e);
        if (Vu(t)) {
          const i = t[1];
          80 & t[2] ? Or(i, t, i.template, t[8]) : t[5] > 0 && Uc(t);
        }
      }
      function Uc(e) {
        for (let i = _c(e); null !== i; i = vc(i))
          for (let r = 10; r < i.length; r++) {
            const o = i[r];
            if (1024 & o[2]) {
              const s = o[1];
              Or(s, o, s.template, o[8]);
            } else o[5] > 0 && Uc(o);
          }
        const t = e[1].components;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const r = kt(t[i], e);
            Vu(r) && r[5] > 0 && Uc(r);
          }
      }
      function PM(e, n) {
        const t = kt(n, e),
          i = t[1];
        (function kM(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++)
            n.push(e.blueprint[t]);
        })(i, t),
          Uo(i, t, t[8]);
      }
      function ka(e, n) {
        return e[13] ? (e[14][4] = n) : (e[13] = n), (e[14] = n), n;
      }
      function zc(e, n, t) {
        const i = n[10];
        i.begin && i.begin();
        try {
          Or(e, n, e.template, t);
        } catch (r) {
          throw (
            ((function Rm(e, n) {
              const t = e[9],
                i = t ? t.get(Bo, null) : null;
              i && i.handleError(n);
            })(n, r),
            r)
          );
        } finally {
          i.end && i.end();
        }
      }
      function Sm(e) {
        !(function Wc(e) {
          for (let n = 0; n < e.components.length; n++) {
            const t = e.components[n],
              i = fc(t),
              r = i[1];
            pM(r, i, r.template, t);
          }
        })(e[8]);
      }
      function Yc(e, n, t) {
        Gu(0), n(e, t);
      }
      const BM = (() => Promise.resolve(null))();
      function xm(e, n, t, i, r) {
        for (let o = 0; o < t.length; ) {
          const s = t[o++],
            a = t[o++],
            l = n[s],
            u = e.data[s];
          null !== u.setInput ? u.setInput(l, r, i, a) : (l[a] = r);
        }
      }
      function Fa(e, n, t) {
        let i = t ? e.styles : null,
          r = t ? e.classes : null,
          o = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (r = Du(r, a))
              : 2 == o && (i = Du(i, a + ": " + n[++s] + ";"));
          }
        t ? (e.styles = i) : (e.stylesWithoutHost = i),
          t ? (e.classes = r) : (e.classesWithoutHost = r);
      }
      const qc = new W("INJECTOR", -1);
      class Pm {
        get(n, t = Io) {
          if (t === Io) {
            const i = new Error(`NullInjectorError: No provider for ${oe(n)}!`);
            throw ((i.name = "NullInjectorError"), i);
          }
          return t;
        }
      }
      const Jc = new W("Set Injector scope."),
        Go = {},
        $M = {};
      let Zc;
      function km() {
        return void 0 === Zc && (Zc = new Pm()), Zc;
      }
      function Fm(e, n = null, t = null, i) {
        const r = Lm(e, n, t, i);
        return r._resolveInjectorDefTypes(), r;
      }
      function Lm(e, n = null, t = null, i) {
        return new UM(e, t, n || km(), i);
      }
      class UM {
        constructor(n, t, i, r = null) {
          (this.parent = i),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const o = [];
          t && Sn(t, (a) => this.processProvider(a, n, t)),
            Sn([n], (a) => this.processInjectorType(a, [], o)),
            this.records.set(qc, Rr(void 0, this));
          const s = this.records.get(Jc);
          (this.scope = null != s ? s.value : null),
            (this.source = r || ("object" == typeof n ? null : oe(n)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach((n) => n.ngOnDestroy());
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear();
          }
        }
        get(n, t = Io, i = F.Default) {
          this.assertNotDestroyed();
          const r = ag(this),
            o = di(void 0);
          try {
            if (!(i & F.SkipSelf)) {
              let a = this.records.get(n);
              if (void 0 === a) {
                const l =
                  (function QM(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof W)
                    );
                  })(n) && wu(n);
                (a = l && this.injectableDefInScope(l) ? Rr(Qc(n), Go) : null),
                  this.records.set(n, a);
              }
              if (null != a) return this.hydrate(n, a);
            }
            return (i & F.Self ? km() : this.parent).get(
              n,
              (t = i & F.Optional && t === Io ? null : t)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Da] = s[Da] || []).unshift(oe(n)), r)) throw s;
              return (function EE(e, n, t, i) {
                const r = e[Da];
                throw (
                  (n[sg] && r.unshift(n[sg]),
                  (e.message = (function NE(e, n, t, i = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.substr(2)
                        : e;
                    let r = oe(n);
                    if (Array.isArray(n)) r = n.map(oe).join(" -> ");
                    else if ("object" == typeof n) {
                      let o = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : oe(a))
                          );
                        }
                      r = `{${o.join(", ")}}`;
                    }
                    return `${t}${i ? "(" + i + ")" : ""}[${r}]: ${e.replace(
                      vE,
                      "\n  "
                    )}`;
                  })("\n" + e.message, r, t, i)),
                  (e.ngTokenPath = r),
                  (e[Da] = null),
                  e)
                );
              })(s, n, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            di(o), ag(r);
          }
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach((n) => this.get(n));
        }
        toString() {
          const n = [];
          return (
            this.records.forEach((i, r) => n.push(oe(r))),
            `R3Injector[${n.join(", ")}]`
          );
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new X(205, !1);
        }
        processInjectorType(n, t, i) {
          if (!(n = j(n))) return !1;
          let r = _p(n);
          const o = (null == r && n.ngModule) || void 0,
            s = void 0 === o ? n : o,
            a = -1 !== i.indexOf(s);
          if ((void 0 !== o && (r = _p(o)), null == r)) return !1;
          if (null != r.imports && !a) {
            let c;
            i.push(s);
            try {
              Sn(r.imports, (d) => {
                this.processInjectorType(d, t, i) &&
                  (void 0 === c && (c = []), c.push(d));
              });
            } finally {
            }
            if (void 0 !== c)
              for (let d = 0; d < c.length; d++) {
                const { ngModule: f, providers: h } = c[d];
                Sn(h, (p) => this.processProvider(p, f, h || he));
              }
          }
          this.injectorDefTypes.add(s);
          const l = Vi(s) || (() => new s());
          this.records.set(s, Rr(l, Go));
          const u = r.providers;
          if (null != u && !a) {
            const c = n;
            Sn(u, (d) => this.processProvider(d, c, u));
          }
          return void 0 !== o && void 0 !== n.providers;
        }
        processProvider(n, t, i) {
          let r = xr((n = j(n))) ? n : j(n && n.provide);
          const o = (function WM(e, n, t) {
            return Bm(e)
              ? Rr(void 0, e.useValue)
              : Rr(
                  (function Vm(e, n, t) {
                    let i;
                    if (xr(e)) {
                      const r = j(e);
                      return Vi(r) || Qc(r);
                    }
                    if (Bm(e)) i = () => j(e.useValue);
                    else if (
                      (function YM(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      i = () => e.useFactory(...ic(e.deps || []));
                    else if (
                      (function zM(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      i = () => T(j(e.useExisting));
                    else {
                      const r = j(e && (e.useClass || e.provide));
                      if (
                        !(function JM(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return Vi(r) || Qc(r);
                      i = () => new r(...ic(e.deps));
                    }
                    return i;
                  })(e),
                  Go
                );
          })(n);
          if (xr(n) || !0 !== n.multi) this.records.get(r);
          else {
            let s = this.records.get(r);
            s ||
              ((s = Rr(void 0, Go, !0)),
              (s.factory = () => ic(s.multi)),
              this.records.set(r, s)),
              (r = n),
              s.multi.push(n);
          }
          this.records.set(r, o);
        }
        hydrate(n, t) {
          return (
            t.value === Go && ((t.value = $M), (t.value = t.factory())),
            "object" == typeof t.value &&
              t.value &&
              (function ZM(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(t.value) &&
              this.onDestroy.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = j(n.providedIn);
          return "string" == typeof t
            ? "any" === t || t === this.scope
            : this.injectorDefTypes.has(t);
        }
      }
      function Qc(e) {
        const n = wu(e),
          t = null !== n ? n.factory : Vi(e);
        if (null !== t) return t;
        if (e instanceof W) throw new X(204, !1);
        if (e instanceof Function)
          return (function GM(e) {
            const n = e.length;
            if (n > 0) throw (Ao(n, "?"), new X(204, !1));
            const t = (function nw(e) {
              const n = e && (e[Ks] || e[vp]);
              if (n) {
                const t = (function iw(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const n = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === n ? "" : n[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${t}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${t}" class.`
                  ),
                  n
                );
              }
              return null;
            })(e);
            return null !== t ? () => t.factory(e) : () => new e();
          })(e);
        throw new X(204, !1);
      }
      function Rr(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function Bm(e) {
        return null !== e && "object" == typeof e && bE in e;
      }
      function xr(e) {
        return "function" == typeof e;
      }
      let et = (() => {
        class e {
          static create(t, i) {
            var r;
            if (Array.isArray(t)) return Fm({ name: "" }, i, t, "");
            {
              const o = null !== (r = t.name) && void 0 !== r ? r : "";
              return Fm({ name: o }, t.parent, t.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Io),
          (e.NULL = new Pm()),
          (e.??prov = x({ token: e, providedIn: "any", factory: () => T(qc) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function oT(e, n) {
        ca(fc(e)[1], ze());
      }
      let La = null;
      function Pr() {
        if (!La) {
          const e = ue.Symbol;
          if (e && e.iterator) La = e.iterator;
          else {
            const n = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < n.length; ++t) {
              const i = n[t];
              "entries" !== i &&
                "size" !== i &&
                Map.prototype[i] === Map.prototype.entries &&
                (La = i);
            }
          }
        }
        return La;
      }
      function ft(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function Hi(e, n, t, i) {
        const r = ft(e, n, t);
        return ft(e, n + 1, i) || r;
      }
      function ae(e, n, t, i) {
        const r = b();
        return (
          ft(r, mr(), n) &&
            (ee(),
            (function On(e, n, t, i, r, o) {
              const s = qt(e, n);
              $c(n[H], s, o, e.value, t, i, r);
            })(Oe(), r, e, n, t, i)),
          ae
        );
      }
      function Fr(e, n, t, i) {
        return ft(e, mr(), t) ? n + L(t) + i : V;
      }
      function Br(e, n, t, i, r, o, s, a, l, u) {
        const d = (function Zt(e, n, t, i, r, o) {
          const s = Hi(e, n, t, i);
          return Hi(e, n + 2, r, o) || s;
        })(e, Yn(), t, r, s, l);
        return qn(4), d ? n + L(t) + i + L(r) + o + L(s) + a + L(l) + u : V;
      }
      function _(e, n = F.Default) {
        const t = b();
        return null === t ? T(e, n) : Zp(ze(), t, j(e), n);
      }
      function sd() {
        throw new Error("invalid");
      }
      function Y(e, n, t) {
        const i = b();
        return ft(i, mr(), n) && Bt(ee(), Oe(), i, e, n, i[H], t, !1), Y;
      }
      function ad(e, n, t, i, r) {
        const s = r ? "class" : "style";
        xm(e, t, n.inputs[s], s, i);
      }
      function A(e, n, t, i) {
        const r = b(),
          o = ee(),
          s = 20 + e,
          a = r[H],
          l = (r[s] = bc(
            a,
            n,
            (function Yw() {
              return P.lFrame.currentNamespace;
            })()
          )),
          u = o.firstCreatePass
            ? (function LT(e, n, t, i, r, o, s) {
                const a = n.consts,
                  u = Ar(n, e, 2, r, pi(a, o));
                return (
                  Hc(n, t, u, pi(a, s)),
                  null !== u.attrs && Fa(u, u.attrs, !1),
                  null !== u.mergedAttrs && Fa(u, u.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, u),
                  u
                );
              })(s, o, r, 0, n, t, i)
            : o.data[s];
        Tn(u, !0);
        const c = u.mergedAttrs;
        null !== c && ha(a, l, c);
        const d = u.classes;
        null !== d && Mc(a, l, d);
        const f = u.styles;
        return (
          null !== f && Zg(a, l, f),
          64 != (64 & u.flags) && Aa(o, r, l, u),
          0 ===
            (function Ow() {
              return P.lFrame.elementDepthCount;
            })() && dt(l, r),
          (function Rw() {
            P.lFrame.elementDepthCount++;
          })(),
          ra(u) &&
            (Bc(o, r, u),
            (function gm(e, n, t) {
              if (Iu(n)) {
                const r = n.directiveEnd;
                for (let o = n.directiveStart; o < r; o++) {
                  const s = e.data[o];
                  s.contentQueries && s.contentQueries(1, t[o], o);
                }
              }
            })(o, u, r)),
          null !== i && jc(r, u),
          A
        );
      }
      function O() {
        let e = ze();
        ju() ? Hu() : ((e = e.parent), Tn(e, !1));
        const n = e;
        !(function xw() {
          P.lFrame.elementDepthCount--;
        })();
        const t = ee();
        return (
          t.firstCreatePass && (ca(t, e), Iu(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function Kw(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            ad(t, n, b(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function Xw(e) {
              return 0 != (32 & e.flags);
            })(n) &&
            ad(t, n, b(), n.stylesWithoutHost, !1),
          O
        );
      }
      function At(e, n, t, i) {
        return A(e, n, t, i), O(), At;
      }
      function Yo(e) {
        return !!e && "function" == typeof e.then;
      }
      const cd = function v_(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function de(e = 1) {
        return (function Hw(e) {
          return (P.lFrame.contextLView = (function $w(e, n) {
            for (; e > 0; ) (n = n[15]), e--;
            return n;
          })(e, P.lFrame.contextLView))[8];
        })(e);
      }
      function jT(e, n) {
        let t = null;
        const i = (function qN(e) {
          const n = e.attrs;
          if (null != n) {
            const t = n.indexOf(5);
            if (0 == (1 & t)) return n[t + 1];
          }
          return null;
        })(e);
        for (let r = 0; r < n.length; r++) {
          const o = n[r];
          if ("*" !== o) {
            if (null === i ? em(e, o, !0) : QN(i, o)) return r;
          } else t = r;
        }
        return t;
      }
      function fd(e) {
        const n = b()[16][6];
        if (!n.projection) {
          const i = (n.projection = Ao(e ? e.length : 1, null)),
            r = i.slice();
          let o = n.child;
          for (; null !== o; ) {
            const s = e ? jT(o, e) : 0;
            null !== s &&
              (r[s] ? (r[s].projectionNext = o) : (i[s] = o), (r[s] = o)),
              (o = o.next);
          }
        }
      }
      function hd(e, n = 0, t) {
        const i = b(),
          r = ee(),
          o = Ar(r, 20 + e, 16, null, t || null);
        null === o.projection && (o.projection = n),
          Hu(),
          64 != (64 & o.flags) &&
            (function HN(e, n, t) {
              Jg(n[H], 0, n, t, Bg(e, t, n), Ug(t.parent || n[6], t, n));
            })(r, i, o);
      }
      function jt(e, n, t) {
        return ja(e, "", n, "", t), jt;
      }
      function ja(e, n, t, i, r) {
        const o = b(),
          s = Fr(o, n, t, i);
        return s !== V && Bt(ee(), Oe(), o, e, s, o[H], r, !1), ja;
      }
      function I_(e, n, t, i, r) {
        const o = e[t + 1],
          s = null === n;
        let a = i ? cn(o) : Jn(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = e[a + 1];
          UT(e[a], n) && ((l = !0), (e[a + 1] = i ? Ac(c) : Tc(c))),
            (a = i ? cn(c) : Jn(c));
        }
        l && (e[t + 1] = i ? Tc(o) : Ac(o));
      }
      function UT(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || "string" != typeof n) && Er(e, n) >= 0)
        );
      }
      const qe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function O_(e) {
        return e.substring(qe.key, qe.keyEnd);
      }
      function R_(e, n) {
        const t = qe.textEnd;
        return t === n
          ? -1
          : ((n = qe.keyEnd =
              (function YT(e, n, t) {
                for (; n < t && e.charCodeAt(n) > 32; ) n++;
                return n;
              })(e, (qe.key = n), t)),
            Wr(e, n, t));
      }
      function Wr(e, n, t) {
        for (; n < t && e.charCodeAt(n) <= 32; ) n++;
        return n;
      }
      function qo(e, n, t) {
        return fn(e, n, t, !1), qo;
      }
      function Ne(e, n) {
        return fn(e, n, null, !0), Ne;
      }
      function $i(e) {
        hn(Ft, Pn, e, !0);
      }
      function Pn(e, n) {
        for (
          let t = (function WT(e) {
            return (
              (function P_(e) {
                (qe.key = 0),
                  (qe.keyEnd = 0),
                  (qe.value = 0),
                  (qe.valueEnd = 0),
                  (qe.textEnd = e.length);
              })(e),
              R_(e, Wr(e, 0, qe.textEnd))
            );
          })(n);
          t >= 0;
          t = R_(n, t)
        )
          Ft(e, O_(n), !0);
      }
      function fn(e, n, t, i) {
        const r = b(),
          o = ee(),
          s = qn(2);
        o.firstUpdatePass && V_(o, e, s, i),
          n !== V &&
            ft(r, s, n) &&
            j_(
              o,
              o.data[vt()],
              r,
              r[H],
              e,
              (r[s + 1] = (function iS(e, n) {
                return (
                  null == e ||
                    ("string" == typeof n
                      ? (e += n)
                      : "object" == typeof e && (e = oe(vi(e)))),
                  e
                );
              })(n, t)),
              i,
              s
            );
      }
      function hn(e, n, t, i) {
        const r = ee(),
          o = qn(2);
        r.firstUpdatePass && V_(r, null, o, i);
        const s = b();
        if (t !== V && ft(s, o, t)) {
          const a = r.data[vt()];
          if ($_(a, i) && !L_(r, o)) {
            let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
            null !== l && (t = Du(l, t || "")), ad(r, a, s, t, i);
          } else
            !(function nS(e, n, t, i, r, o, s, a) {
              r === V && (r = he);
              let l = 0,
                u = 0,
                c = 0 < r.length ? r[0] : null,
                d = 0 < o.length ? o[0] : null;
              for (; null !== c || null !== d; ) {
                const f = l < r.length ? r[l + 1] : void 0,
                  h = u < o.length ? o[u + 1] : void 0;
                let g,
                  p = null;
                c === d
                  ? ((l += 2), (u += 2), f !== h && ((p = d), (g = h)))
                  : null === d || (null !== c && c < d)
                  ? ((l += 2), (p = c))
                  : ((u += 2), (p = d), (g = h)),
                  null !== p && j_(e, n, t, i, p, g, s, a),
                  (c = l < r.length ? r[l] : null),
                  (d = u < o.length ? o[u] : null);
              }
            })(
              r,
              a,
              s,
              s[H],
              s[o + 1],
              (s[o + 1] = (function tS(e, n, t) {
                if (null == t || "" === t) return he;
                const i = [],
                  r = vi(t);
                if (Array.isArray(r))
                  for (let o = 0; o < r.length; o++) e(i, r[o], !0);
                else if ("object" == typeof r)
                  for (const o in r) r.hasOwnProperty(o) && e(i, o, r[o]);
                else "string" == typeof r && n(i, r);
                return i;
              })(e, n, t)),
              i,
              o
            );
        }
      }
      function L_(e, n) {
        return n >= e.expandoStartIndex;
      }
      function V_(e, n, t, i) {
        const r = e.data;
        if (null === r[t + 1]) {
          const o = r[vt()],
            s = L_(e, t);
          $_(o, i) && null === n && !s && (n = !1),
            (n = (function QT(e, n, t, i) {
              const r = (function Uu(e) {
                const n = P.lFrame.currentDirectiveIndex;
                return -1 === n ? null : e[n];
              })(e);
              let o = i ? n.residualClasses : n.residualStyles;
              if (null === r)
                0 === (i ? n.classBindings : n.styleBindings) &&
                  ((t = Jo((t = pd(null, e, n, t, i)), n.attrs, i)),
                  (o = null));
              else {
                const s = n.directiveStylingLast;
                if (-1 === s || e[s] !== r)
                  if (((t = pd(r, e, n, t, i)), null === o)) {
                    let l = (function KT(e, n, t) {
                      const i = t ? n.classBindings : n.styleBindings;
                      if (0 !== Jn(i)) return e[cn(i)];
                    })(e, n, i);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = pd(null, e, n, l[1], i)),
                      (l = Jo(l, n.attrs, i)),
                      (function XT(e, n, t, i) {
                        e[cn(t ? n.classBindings : n.styleBindings)] = i;
                      })(e, n, i, l));
                  } else
                    o = (function eS(e, n, t) {
                      let i;
                      const r = n.directiveEnd;
                      for (let o = 1 + n.directiveStylingLast; o < r; o++)
                        i = Jo(i, e[o].hostAttrs, t);
                      return Jo(i, n.attrs, t);
                    })(e, n, i);
              }
              return (
                void 0 !== o &&
                  (i ? (n.residualClasses = o) : (n.residualStyles = o)),
                t
              );
            })(r, o, n, i)),
            (function HT(e, n, t, i, r, o) {
              let s = o ? n.classBindings : n.styleBindings,
                a = cn(s),
                l = Jn(s);
              e[i] = t;
              let c,
                u = !1;
              if (Array.isArray(t)) {
                const d = t;
                (c = d[1]), (null === c || Er(d, c) > 0) && (u = !0);
              } else c = t;
              if (r)
                if (0 !== l) {
                  const f = cn(e[a + 1]);
                  (e[i + 1] = Oa(f, a)),
                    0 !== f && (e[f + 1] = Sc(e[f + 1], i)),
                    (e[a + 1] = (function tM(e, n) {
                      return (131071 & e) | (n << 17);
                    })(e[a + 1], i));
                } else
                  (e[i + 1] = Oa(a, 0)),
                    0 !== a && (e[a + 1] = Sc(e[a + 1], i)),
                    (a = i);
              else
                (e[i + 1] = Oa(l, 0)),
                  0 === a ? (a = i) : (e[l + 1] = Sc(e[l + 1], i)),
                  (l = i);
              u && (e[i + 1] = Tc(e[i + 1])),
                I_(e, c, i, !0),
                I_(e, c, i, !1),
                (function $T(e, n, t, i, r) {
                  const o = r ? e.residualClasses : e.residualStyles;
                  null != o &&
                    "string" == typeof n &&
                    Er(o, n) >= 0 &&
                    (t[i + 1] = Ac(t[i + 1]));
                })(n, c, e, i, o),
                (s = Oa(a, l)),
                o ? (n.classBindings = s) : (n.styleBindings = s);
            })(r, o, n, t, s, i);
        }
      }
      function pd(e, n, t, i, r) {
        let o = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (
          -1 === a ? (a = t.directiveStart) : a++;
          a < s && ((o = n[a]), (i = Jo(i, o.hostAttrs, r)), o !== e);

        )
          a++;
        return null !== e && (t.directiveStylingLast = a), i;
      }
      function Jo(e, n, t) {
        const i = t ? 1 : 2;
        let r = -1;
        if (null !== n)
          for (let o = 0; o < n.length; o++) {
            const s = n[o];
            "number" == typeof s
              ? (r = s)
              : r === i &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Ft(e, s, !!t || n[++o]));
          }
        return void 0 === e ? null : e;
      }
      function j_(e, n, t, i, r, o, s, a) {
        if (!(3 & n.type)) return;
        const l = e.data,
          u = l[a + 1];
        Ha(
          (function om(e) {
            return 1 == (1 & e);
          })(u)
            ? H_(l, n, t, r, Jn(u), s)
            : void 0
        ) ||
          (Ha(o) ||
            ((function rm(e) {
              return 2 == (2 & e);
            })(u) &&
              (o = H_(l, null, t, r, a, s))),
          (function UN(e, n, t, i, r) {
            const o = Ie(e);
            if (n)
              r
                ? o
                  ? e.addClass(t, i)
                  : t.classList.add(i)
                : o
                ? e.removeClass(t, i)
                : t.classList.remove(i);
            else {
              let s = -1 === i.indexOf("-") ? void 0 : Vt.DashCase;
              if (null == r)
                o ? e.removeStyle(t, i, s) : t.style.removeProperty(i);
              else {
                const a = "string" == typeof r && r.endsWith("!important");
                a && ((r = r.slice(0, -10)), (s |= Vt.Important)),
                  o
                    ? e.setStyle(t, i, r, s)
                    : t.style.setProperty(i, r, a ? "important" : "");
              }
            }
          })(i, s, oa(vt(), t), r, o));
      }
      function H_(e, n, t, i, r, o) {
        const s = null === n;
        let a;
        for (; r > 0; ) {
          const l = e[r],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = t[r + 1];
          f === V && (f = d ? he : void 0);
          let h = d ? ec(f, i) : c === i ? f : void 0;
          if ((u && !Ha(h) && (h = ec(l, i)), Ha(h) && ((a = h), s))) return a;
          const p = e[r + 1];
          r = s ? cn(p) : Jn(p);
        }
        if (null !== n) {
          let l = o ? n.residualClasses : n.residualStyles;
          null != l && (a = ec(l, i));
        }
        return a;
      }
      function Ha(e) {
        return void 0 !== e;
      }
      function $_(e, n) {
        return 0 != (e.flags & (n ? 16 : 32));
      }
      function Ue(e, n = "") {
        const t = b(),
          i = ee(),
          r = e + 20,
          o = i.firstCreatePass ? Ar(i, r, 1, n, null) : i.data[r],
          s = (t[r] = yc(t[H], n));
        Aa(i, t, s, o), Tn(o, !1);
      }
      function Ht(e, n, t) {
        const i = b(),
          r = Fr(i, e, n, t);
        return (
          r !== V &&
            (function Zn(e, n, t) {
              const i = oa(n, e);
              Fg(e[H], i, t);
            })(i, vt(), r),
          Ht
        );
      }
      const Gi = void 0;
      var CS = [
        "en",
        [["a", "p"], ["AM", "PM"], Gi],
        [["AM", "PM"], Gi, Gi],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Gi,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Gi,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Gi, "{1} 'at' {0}", Gi],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function DS(e) {
          const t = Math.floor(Math.abs(e)),
            i = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === t && 0 === i ? 1 : 5;
        },
      ];
      let zr = {};
      function bt(e) {
        const n = (function wS(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let t = cv(n);
        if (t) return t;
        const i = n.split("-")[0];
        if (((t = cv(i)), t)) return t;
        if ("en" === i) return CS;
        throw new Error(`Missing locale data for the locale "${e}".`);
      }
      function cv(e) {
        return (
          e in zr ||
            (zr[e] =
              ue.ng &&
              ue.ng.common &&
              ue.ng.common.locales &&
              ue.ng.common.locales[e]),
          zr[e]
        );
      }
      var N = (() => (
        ((N = N || {})[(N.LocaleId = 0)] = "LocaleId"),
        (N[(N.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (N[(N.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (N[(N.DaysFormat = 3)] = "DaysFormat"),
        (N[(N.DaysStandalone = 4)] = "DaysStandalone"),
        (N[(N.MonthsFormat = 5)] = "MonthsFormat"),
        (N[(N.MonthsStandalone = 6)] = "MonthsStandalone"),
        (N[(N.Eras = 7)] = "Eras"),
        (N[(N.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (N[(N.WeekendRange = 9)] = "WeekendRange"),
        (N[(N.DateFormat = 10)] = "DateFormat"),
        (N[(N.TimeFormat = 11)] = "TimeFormat"),
        (N[(N.DateTimeFormat = 12)] = "DateTimeFormat"),
        (N[(N.NumberSymbols = 13)] = "NumberSymbols"),
        (N[(N.NumberFormats = 14)] = "NumberFormats"),
        (N[(N.CurrencyCode = 15)] = "CurrencyCode"),
        (N[(N.CurrencySymbol = 16)] = "CurrencySymbol"),
        (N[(N.CurrencyName = 17)] = "CurrencyName"),
        (N[(N.Currencies = 18)] = "Currencies"),
        (N[(N.Directionality = 19)] = "Directionality"),
        (N[(N.PluralCase = 20)] = "PluralCase"),
        (N[(N.ExtraData = 21)] = "ExtraData"),
        N
      ))();
      const ES = ["zero", "one", "two", "few", "many"],
        $a = "en-US",
        Ua = { marker: "element" },
        Ga = { marker: "ICU" };
      var Re = (() => (
        ((Re = Re || {})[(Re.SHIFT = 2)] = "SHIFT"),
        (Re[(Re.APPEND_EAGERLY = 1)] = "APPEND_EAGERLY"),
        (Re[(Re.COMMENT = 2)] = "COMMENT"),
        Re
      ))();
      let dv = $a;
      function fv(e, n, t) {
        const i = n.insertBeforeIndex,
          r = Array.isArray(i) ? i[0] : i;
        return null === r ? Gg(e, 0, t) : He(t[r]);
      }
      function hv(e, n, t, i, r) {
        const o = n.insertBeforeIndex;
        if (Array.isArray(o)) {
          let s = i,
            a = null;
          if (
            (3 & n.type || ((a = s), (s = r)), null !== s && 0 == (2 & n.flags))
          )
            for (let l = 1; l < o.length; l++) ji(e, s, t[o[l]], a, !1);
        }
      }
      function pv(e, n) {
        if ((e.push(n), e.length > 1))
          for (let t = e.length - 2; t >= 0; t--) {
            const i = e[t];
            gv(i) || (AS(i, n) && null === IS(i) && OS(i, n.index));
          }
      }
      function gv(e) {
        return !(64 & e.type);
      }
      function AS(e, n) {
        return gv(n) || e.index > n.index;
      }
      function IS(e) {
        const n = e.insertBeforeIndex;
        return Array.isArray(n) ? n[0] : n;
      }
      function OS(e, n) {
        const t = e.insertBeforeIndex;
        Array.isArray(t) ? (t[0] = n) : (zg(fv, hv), (e.insertBeforeIndex = n));
      }
      function Zo(e, n) {
        const t = e.data[n];
        return null === t || "string" == typeof t
          ? null
          : t.hasOwnProperty("currentCaseLViewIndex")
          ? t
          : t.value;
      }
      function PS(e, n, t) {
        const i = Vc(e, t, 64, null, null);
        return pv(n, i), i;
      }
      function Wa(e, n) {
        const t = n[e.currentCaseLViewIndex];
        return null === t ? t : t < 0 ? ~t : t;
      }
      function mv(e) {
        return e >>> 17;
      }
      function _v(e) {
        return (131070 & e) >>> 1;
      }
      let Qo = 0,
        Ko = 0;
      function yv(e, n, t, i) {
        const r = t[H];
        let s,
          o = null;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ("string" == typeof l) {
            const u = n[++a];
            null === t[u] && (t[u] = yc(r, l));
          } else if ("number" == typeof l)
            switch (1 & l) {
              case 0:
                const u = mv(l);
                let c, d;
                if (
                  (null === o && ((o = u), (s = Sa(r, i))),
                  u === o ? ((c = i), (d = s)) : ((c = null), (d = He(t[u]))),
                  null !== d)
                ) {
                  const g = _v(l);
                  ji(r, d, t[g], c, !1);
                  const y = Zo(e, g);
                  if (null !== y && "object" == typeof y) {
                    const m = Wa(y, t);
                    null !== m && yv(e, y.create[m], t, t[y.anchorIdx]);
                  }
                }
                break;
              case 1:
                const h = n[++a],
                  p = n[++a];
                $c(r, oa(l >>> 1, t), null, null, h, p, null);
            }
          else
            switch (l) {
              case Ga:
                const u = n[++a],
                  c = n[++a];
                null === t[c] && dt((t[c] = IN(r, u)), t);
                break;
              case Ua:
                const d = n[++a],
                  f = n[++a];
                null === t[f] && dt((t[f] = bc(r, d, null)), t);
            }
        }
      }
      function bv(e, n, t, i, r) {
        for (let o = 0; o < t.length; o++) {
          const s = t[o],
            a = t[++o];
          if (s & r) {
            let l = "";
            for (let u = o + 1; u <= o + a; u++) {
              const c = t[u];
              if ("string" == typeof c) l += c;
              else if ("number" == typeof c)
                if (c < 0) l += L(n[i - c]);
                else {
                  const d = c >>> 2;
                  switch (3 & c) {
                    case 1:
                      const f = t[++u],
                        h = t[++u],
                        p = e.data[d];
                      "string" == typeof p
                        ? $c(n[H], n[d], null, p, f, l, h)
                        : Bt(e, p, n, f, l, n[H], h, !1);
                      break;
                    case 0:
                      const g = n[d];
                      null !== g && Fg(n[H], g, l);
                      break;
                    case 2:
                      BS(e, Zo(e, d), n, l);
                      break;
                    case 3:
                      Dv(e, Zo(e, d), i, n);
                  }
                }
            }
          } else {
            const l = t[o + 1];
            if (l > 0 && 3 == (3 & l)) {
              const c = Zo(e, l >>> 2);
              n[c.currentCaseLViewIndex] < 0 && Dv(e, c, i, n);
            }
          }
          o += a;
        }
      }
      function Dv(e, n, t, i) {
        let r = i[n.currentCaseLViewIndex];
        if (null !== r) {
          let o = Qo;
          r < 0 && ((r = i[n.currentCaseLViewIndex] = ~r), (o = -1)),
            bv(e, i, n.update[r], t, o);
        }
      }
      function BS(e, n, t, i) {
        const r = (function jS(e, n) {
          let t = e.cases.indexOf(n);
          if (-1 === t)
            switch (e.type) {
              case 1: {
                const i = (function NS(e, n) {
                  const t = (function uv(e) {
                      return bt(e)[N.PluralCase];
                    })(n)(parseInt(e, 10)),
                    i = ES[t];
                  return void 0 !== i ? i : "other";
                })(
                  n,
                  (function SS() {
                    return dv;
                  })()
                );
                (t = e.cases.indexOf(i)),
                  -1 === t && "other" !== i && (t = e.cases.indexOf("other"));
                break;
              }
              case 0:
                t = e.cases.indexOf("other");
            }
          return -1 === t ? null : t;
        })(n, i);
        if (
          Wa(n, t) !== r &&
          (Cv(e, n, t),
          (t[n.currentCaseLViewIndex] = null === r ? null : ~r),
          null !== r)
        ) {
          const s = t[n.anchorIdx];
          s && yv(e, n.create[r], t, s);
        }
      }
      function Cv(e, n, t) {
        let i = Wa(n, t);
        if (null !== i) {
          const r = n.remove[i];
          for (let o = 0; o < r.length; o++) {
            const s = r[o];
            if (s > 0) {
              const a = oa(s, t);
              null !== a && qg(t[H], a);
            } else Cv(e, Zo(e, ~s), t);
          }
        }
      }
      function HS() {
        const e = [];
        let t,
          i,
          n = -1;
        function o(a, l) {
          n = 0;
          const u = Wa(a, l);
          i = null !== u ? a.remove[u] : he;
        }
        function s() {
          if (n < i.length) {
            const a = i[n++];
            return a > 0 ? t[a] : (e.push(n, i), o(t[1].data[~a], t), s());
          }
          return 0 === e.length ? null : ((i = e.pop()), (n = e.pop()), s());
        }
        return function r(a, l) {
          for (t = l; e.length; ) e.pop();
          return o(a.value, l), s;
        };
      }
      const za = /\ufffd(\d+):?\d*\ufffd/gi,
        US = /\ufffd(\d+)\ufffd/,
        Ev = /^\s*(\ufffd\d+:?\d*\ufffd)\s*,\s*(select|plural)\s*,/,
        GS = /\ufffd\/?\*(\d+:\d+)\ufffd/gi,
        WS = /\ufffd(\/?[#*]\d+):?\d*\ufffd/gi,
        zS = /\uE500/g;
      function Nv(e, n, t, i, r, o, s) {
        const a = Ir(e, i, 1, null);
        let l = a << Re.SHIFT,
          u = Co();
        n === u && (u = null),
          null === u && (l |= Re.APPEND_EAGERLY),
          s &&
            ((l |= Re.COMMENT),
            (function AN(e) {
              void 0 === gc && (gc = e());
            })(HS)),
          r.push(l, null === o ? "" : o);
        const c = Vc(e, a, s ? 32 : 1, null === o ? "" : o, null);
        pv(t, c);
        const d = c.index;
        return (
          Tn(c, !1),
          null !== u &&
            n !== u &&
            (function xS(e, n) {
              let t = e.insertBeforeIndex;
              null === t
                ? (zg(fv, hv), (t = e.insertBeforeIndex = [null, n]))
                : ((function Gn(e, n, t) {
                    e != n && De(t, e, n, "==");
                  })(Array.isArray(t), !0, "Expecting array here"),
                  t.push(n));
            })(u, d),
          c
        );
      }
      function JS(e, n, t, i, r, o, s) {
        const a = s.match(za),
          l = Nv(e, n, t, o, i, a ? null : s, !1);
        a && Yr(r, s, l.index, null, 0, null);
      }
      function Yr(e, n, t, i, r, o) {
        const s = e.length,
          a = s + 1;
        e.push(null, null);
        const l = s + 2,
          u = n.split(za);
        let c = 0;
        for (let d = 0; d < u.length; d++) {
          const f = u[d];
          if (1 & d) {
            const h = r + parseInt(f, 10);
            e.push(-1 - h), (c |= Mv(h));
          } else "" !== f && e.push(f);
        }
        return (
          e.push((t << 2) | (i ? 1 : 0)),
          i && e.push(i, o),
          (e[s] = c),
          (e[a] = e.length - l),
          c
        );
      }
      function Mv(e) {
        return 1 << Math.min(e, 31);
      }
      function Tv(e) {
        let n,
          o,
          t = "",
          i = 0,
          r = !1;
        for (; null !== (n = GS.exec(e)); )
          r
            ? n[0] === `\ufffd/*${o}\ufffd` && ((i = n.index), (r = !1))
            : ((t += e.substring(i, n.index + n[0].length)),
              (o = n[1]),
              (r = !0));
        return (t += e.substr(i)), t;
      }
      function Sv(e, n, t, i, r, o) {
        let s = 0;
        const a = {
          type: r.type,
          currentCaseLViewIndex: Ir(e, n, 1, null),
          anchorIdx: o,
          cases: [],
          create: [],
          remove: [],
          update: [],
        };
        (function iA(e, n, t) {
          e.push(Mv(n.mainBinding), 2, -1 - n.mainBinding, (t << 2) | 2);
        })(t, r, o),
          (function RS(e, n, t) {
            const i = e.data[n];
            null === i ? (e.data[n] = t) : (i.value = t);
          })(e, o, a);
        const l = r.values;
        for (let u = 0; u < l.length; u++) {
          const c = l[u],
            d = [];
          for (let f = 0; f < c.length; f++) {
            const h = c[f];
            if ("string" != typeof h) {
              const p = d.push(h) - 1;
              c[f] = `\x3c!--\ufffd${p}\ufffd--\x3e`;
            }
          }
          s = tA(e, a, n, t, i, r.cases[u], c.join(""), d) | s;
        }
        s &&
          (function rA(e, n, t) {
            e.push(n, 1, (t << 2) | 3);
          })(t, s, o);
      }
      function eA(e) {
        const n = [],
          t = [];
        let i = 1,
          r = 0;
        const o = gd(
          (e = e.replace(Ev, function (s, a, l) {
            return (
              (i = "select" === l ? 0 : 1), (r = parseInt(a.substr(1), 10)), ""
            );
          }))
        );
        for (let s = 0; s < o.length; ) {
          let a = o[s++].trim();
          1 === i && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")),
            a.length && n.push(a);
          const l = gd(o[s++]);
          n.length > t.length && t.push(l);
        }
        return { type: i, mainBinding: r, cases: n, values: t };
      }
      function gd(e) {
        if (!e) return [];
        let n = 0;
        const t = [],
          i = [],
          r = /[{}]/g;
        let o;
        for (r.lastIndex = 0; (o = r.exec(e)); ) {
          const a = o.index;
          if ("}" == o[0]) {
            if ((t.pop(), 0 == t.length)) {
              const l = e.substring(n, a);
              Ev.test(l) ? i.push(eA(l)) : i.push(l), (n = a + 1);
            }
          } else {
            if (0 == t.length) {
              const l = e.substring(n, a);
              i.push(l), (n = a + 1);
            }
            t.push("{");
          }
        }
        const s = e.substring(n);
        return i.push(s), i;
      }
      function tA(e, n, t, i, r, o, s, a) {
        const l = [],
          u = [],
          c = [];
        n.cases.push(o), n.create.push(l), n.remove.push(u), n.update.push(c);
        const f = (function _g(e) {
            const n = new UE(e);
            return (function GE() {
              try {
                return !!new window.DOMParser().parseFromString(
                  Mr(""),
                  "text/html"
                );
              } catch (e) {
                return !1;
              }
            })()
              ? new $E(n)
              : n;
          })(Fu()).getInertBodyElement(s),
          h =
            (function cc(e) {
              return "content" in e &&
                (function KE(e) {
                  return (
                    e.nodeType === Node.ELEMENT_NODE &&
                    "TEMPLATE" === e.nodeName
                  );
                })(e)
                ? e.content
                : null;
            })(f) || f;
        return h ? Av(e, n, t, i, l, u, c, h, r, a, 0) : 0;
      }
      function Av(e, n, t, i, r, o, s, a, l, u, c) {
        let d = 0,
          f = a.firstChild;
        for (; f; ) {
          const h = Ir(e, t, 1, null);
          switch (f.nodeType) {
            case Node.ELEMENT_NODE:
              const p = f,
                g = p.tagName.toLowerCase();
              if (ac.hasOwnProperty(g)) {
                md(r, Ua, g, l, h), (e.data[h] = g);
                const D = p.attributes;
                for (let w = 0; w < D.length; w++) {
                  const M = D.item(w),
                    k = M.name.toLowerCase();
                  M.value.match(za)
                    ? Cg.hasOwnProperty(k) &&
                      Yr(
                        s,
                        M.value,
                        h,
                        M.name,
                        0,
                        lc[k] ? Ma : uc[k] ? vg : null
                      )
                    : oA(r, h, M);
                }
                (d = Av(e, n, t, i, r, o, s, f, h, u, c + 1) | d), Iv(o, h, c);
              }
              break;
            case Node.TEXT_NODE:
              const v = f.textContent || "",
                y = v.match(za);
              md(r, null, y ? "" : v, l, h),
                Iv(o, h, c),
                y && (d = Yr(s, v, h, null, 0, null) | d);
              break;
            case Node.COMMENT_NODE:
              const m = US.exec(f.textContent || "");
              if (m) {
                const w = u[parseInt(m[1], 10)];
                md(r, Ga, "", l, h), Sv(e, t, i, l, w, h), nA(o, h, c);
              }
          }
          f = f.nextSibling;
        }
        return d;
      }
      function Iv(e, n, t) {
        0 === t && e.push(n);
      }
      function nA(e, n, t) {
        0 === t && (e.push(~n), e.push(n));
      }
      function md(e, n, t, i, r) {
        null !== n && e.push(n),
          e.push(
            t,
            r,
            (function kS(e, n, t) {
              return e | (n << 17) | (t << 1);
            })(0, i, r)
          );
      }
      function oA(e, n, t) {
        e.push((n << 1) | 1, t.name, t.value);
      }
      function Rv(e, n, t = -1) {
        const i = ee(),
          r = b(),
          o = 20 + e,
          s = pi(i.consts, n),
          a = Co();
        i.firstCreatePass &&
          (function qS(e, n, t, i, r, o) {
            const s = Co(),
              a = [],
              l = [],
              u = [[]];
            r = (function XS(e, n) {
              if (
                (function KS(e) {
                  return -1 === e;
                })(n)
              )
                return Tv(e);
              {
                const t = e.indexOf(`:${n}\ufffd`) + 2 + n.toString().length,
                  i = e.search(new RegExp(`\ufffd\\/\\*\\d+:${n}\ufffd`));
                return Tv(e.substring(t, i));
              }
            })(r, o);
            const c = (function YS(e) {
              return e.replace(zS, " ");
            })(r).split(WS);
            for (let d = 0; d < c.length; d++) {
              let f = c[d];
              if (0 == (1 & d)) {
                const h = gd(f);
                for (let p = 0; p < h.length; p++) {
                  let g = h[p];
                  if (0 == (1 & p)) {
                    const v = g;
                    "" !== v && JS(e, s, u[0], a, l, t, v);
                  } else {
                    const v = g;
                    if ("object" != typeof v)
                      throw new Error(
                        `Unable to parse ICU expression in "${r}" message.`
                      );
                    Sv(e, t, l, n, v, Nv(e, s, u[0], t, a, "", !0).index);
                  }
                }
              } else {
                const h = 47 === f.charCodeAt(0),
                  g =
                    (f.charCodeAt(h ? 1 : 0),
                    20 + Number.parseInt(f.substring(h ? 2 : 1)));
                if (h) u.shift(), Tn(Co(), !1);
                else {
                  const v = PS(e, u[0], g);
                  u.unshift([]), Tn(v, !0);
                }
              }
            }
            e.data[i] = { create: a, update: l };
          })(i, null === a ? 0 : a.index, r, o, s, t);
        const l = i.data[o],
          c = jg(i, a === r[6] ? null : a, r);
        (function VS(e, n, t, i) {
          const r = e[H];
          for (let o = 0; o < n.length; o++) {
            const s = n[o++],
              a = n[o],
              l = (s & Re.COMMENT) === Re.COMMENT,
              u = (s & Re.APPEND_EAGERLY) === Re.APPEND_EAGERLY,
              c = s >>> Re.SHIFT;
            let d = e[c];
            null === d && (d = e[c] = l ? r.createComment(a) : yc(r, a)),
              u && null !== t && ji(r, t, d, i, !1);
          }
        })(r, l.create, c, a && 8 & a.type ? r[a.index] : null),
          kp(!0);
      }
      function Xn(e, n, t) {
        Rv(e, n, t),
          (function xv() {
            kp(!1);
          })();
      }
      function Ya(e) {
        return (
          (function FS(e) {
            e && (Qo |= 1 << Math.min(Ko, 31)), Ko++;
          })(ft(b(), mr(), e)),
          Ya
        );
      }
      class kv {}
      class CA {
        resolveComponentFactory(n) {
          throw (function DA(e) {
            const n = Error(
              `No component factory found for ${oe(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let qr = (() => {
        class e {}
        return (e.NULL = new CA()), e;
      })();
      function wA() {
        return Jr(ze(), b());
      }
      function Jr(e, n) {
        return new _e(qt(e, n));
      }
      let _e = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
        }
        return (e.__NG_ELEMENT_ID__ = wA), e;
      })();
      function EA(e) {
        return e instanceof _e ? e.nativeElement : e;
      }
      class Cd {}
      let TA = (() => {
        class e {}
        return (
          (e.??prov = x({ token: e, providedIn: "root", factory: () => null })),
          e
        );
      })();
      class es {
        constructor(n) {
          (this.full = n),
            (this.major = n.split(".")[0]),
            (this.minor = n.split(".")[1]),
            (this.patch = n.split(".").slice(2).join("."));
        }
      }
      const SA = new es("13.2.7"),
        wd = {};
      function qa(e, n, t, i, r = !1) {
        for (; null !== t; ) {
          const o = n[t.index];
          if ((null !== o && i.push(He(o)), an(o)))
            for (let a = 10; a < o.length; a++) {
              const l = o[a],
                u = l[1].firstChild;
              null !== u && qa(l[1], l, u, i);
            }
          const s = t.type;
          if (8 & s) qa(e, n, t.child, i);
          else if (32 & s) {
            const a = mc(t, n);
            let l;
            for (; (l = a()); ) i.push(l);
          } else if (16 & s) {
            const a = Yg(n, t);
            if (Array.isArray(a)) i.push(...a);
            else {
              const l = jo(n[16]);
              qa(l[1], l, a, i, !0);
            }
          }
          t = r ? t.projectionNext : t.next;
        }
        return i;
      }
      class ts {
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const n = this._lView,
            t = n[1];
          return qa(t, n, t.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(n) {
          this._lView[8] = n;
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const n = this._lView[3];
            if (an(n)) {
              const t = n[8],
                i = t ? t.indexOf(this) : -1;
              i > -1 && (Dc(n, i), ya(t, i));
            }
            this._attachedToViewContainer = !1;
          }
          Vg(this._lView[1], this._lView);
        }
        onDestroy(n) {
          ym(this._lView[1], this._lView, null, n);
        }
        markForCheck() {
          !(function Gc(e) {
            for (; e; ) {
              e[2] |= 64;
              const n = jo(e);
              if (gw(e) && !n) return e;
              e = n;
            }
            return null;
          })(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          zc(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {
          !(function LM(e, n, t) {
            aa(!0);
            try {
              zc(e, n, t);
            } finally {
              aa(!1);
            }
          })(this._lView[1], this._lView, this.context);
        }
        attachToViewContainerRef() {
          if (this._appRef) throw new X(902, "");
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function xN(e, n) {
              Ho(e, n, n[H], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new X(902, "");
          this._appRef = n;
        }
      }
      class AA extends ts {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          Sm(this._view);
        }
        checkNoChanges() {
          !(function VM(e) {
            aa(!0);
            try {
              Sm(e);
            } finally {
              aa(!1);
            }
          })(this._view);
        }
        get context() {
          return null;
        }
      }
      class Lv extends qr {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = lt(n);
          return new Ed(t, this.ngModule);
        }
      }
      function Vv(e) {
        const n = [];
        for (let t in e)
          e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class Ed extends kv {
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function XN(e) {
              return e.map(KN).join(",");
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors
              ? n.ngContentSelectors
              : []),
            (this.isBoundToModule = !!t);
        }
        get inputs() {
          return Vv(this.componentDef.inputs);
        }
        get outputs() {
          return Vv(this.componentDef.outputs);
        }
        create(n, t, i, r) {
          const o = (r = r || this.ngModule)
              ? (function OA(e, n) {
                  return {
                    get: (t, i, r) => {
                      const o = e.get(t, wd, r);
                      return o !== wd || i === wd ? o : n.get(t, i, r);
                    },
                  };
                })(n, r.injector)
              : n,
            s = o.get(Cd, Ap),
            a = o.get(TA, null),
            l = s.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            c = i
              ? (function vm(e, n, t) {
                  if (Ie(e)) return e.selectRootElement(n, t === Nn.ShadowDom);
                  let i = "string" == typeof n ? e.querySelector(n) : n;
                  return (i.textContent = ""), i;
                })(l, i, this.componentDef.encapsulation)
              : bc(
                  s.createRenderer(null, this.componentDef),
                  u,
                  (function IA(e) {
                    const n = e.toLowerCase();
                    return "svg" === n ? "svg" : "math" === n ? "math" : null;
                  })(u)
                ),
            d = this.componentDef.onPush ? 576 : 528,
            f = (function Zm(e, n) {
              return {
                components: [],
                scheduler: e || NN,
                clean: BM,
                playerHandler: n || null,
                flags: 0,
              };
            })(),
            h = Pa(0, null, null, 1, 0, null, null, null, null, null),
            p = $o(null, h, f, d, null, null, s, l, a, o);
          let g, v;
          la(p);
          try {
            const y = (function qm(e, n, t, i, r, o) {
              const s = t[1];
              t[20] = e;
              const l = Ar(s, 20, 2, "#host", null),
                u = (l.mergedAttrs = n.hostAttrs);
              null !== u &&
                (Fa(l, u, !0),
                null !== e &&
                  (ha(r, e, u),
                  null !== l.classes && Mc(r, e, l.classes),
                  null !== l.styles && Zg(r, e, l.styles)));
              const c = i.createRenderer(e, n),
                d = $o(
                  t,
                  mm(n),
                  null,
                  n.onPush ? 64 : 16,
                  t[20],
                  l,
                  i,
                  c,
                  o || null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (_a(No(l, t), s, n.type), Em(s, l), Nm(l, t.length, 1)),
                ka(t, d),
                (t[20] = d)
              );
            })(c, this.componentDef, p, s, l);
            if (c)
              if (i) ha(l, c, ["ng-version", SA.full]);
              else {
                const { attrs: m, classes: D } = (function eM(e) {
                  const n = [],
                    t = [];
                  let i = 1,
                    r = 2;
                  for (; i < e.length; ) {
                    let o = e[i];
                    if ("string" == typeof o)
                      2 === r
                        ? "" !== o && n.push(o, e[++i])
                        : 8 === r && t.push(o);
                    else {
                      if (!un(r)) break;
                      r = o;
                    }
                    i++;
                  }
                  return { attrs: n, classes: t };
                })(this.componentDef.selectors[0]);
                m && ha(l, c, m), D && D.length > 0 && Mc(l, c, D.join(" "));
              }
            if (((v = Lu(h, 20)), void 0 !== t)) {
              const m = (v.projection = []);
              for (let D = 0; D < this.ngContentSelectors.length; D++) {
                const w = t[D];
                m.push(null != w ? Array.from(w) : null);
              }
            }
            (g = (function Jm(e, n, t, i, r) {
              const o = t[1],
                s = (function DM(e, n, t) {
                  const i = ze();
                  e.firstCreatePass &&
                    (t.providersResolver && t.providersResolver(t),
                    Mm(e, i, n, Ir(e, n, 1, null), t));
                  const r = Mo(n, e, i.directiveStart, i);
                  dt(r, n);
                  const o = qt(i, n);
                  return o && dt(o, n), r;
                })(o, t, n);
              if (
                (i.components.push(s),
                (e[8] = s),
                r && r.forEach((l) => l(s, n)),
                n.contentQueries)
              ) {
                const l = ze();
                n.contentQueries(1, s, l.directiveStart);
              }
              const a = ze();
              return (
                !o.firstCreatePass ||
                  (null === n.hostBindings && null === n.hostAttrs) ||
                  (gi(a.index),
                  Cm(t[1], a, 0, a.directiveStart, a.directiveEnd, n),
                  wm(n, s)),
                s
              );
            })(y, this.componentDef, p, f, [oT])),
              Uo(h, p, null);
          } finally {
            ua();
          }
          return new xA(this.componentType, g, Jr(v, p), p, v);
        }
      }
      class xA extends class bA {} {
        constructor(n, t, i, r, o) {
          super(),
            (this.location = i),
            (this._rootLView = r),
            (this._tNode = o),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new AA(r)),
            (this.componentType = n);
        }
        get injector() {
          return new yr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      class ei {}
      class Bv {}
      const Zr = new Map();
      class $v extends ei {
        constructor(n, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Lv(this));
          const i = Wt(n);
          (this._bootstrapComponents = In(i.bootstrap)),
            (this._r3Injector = Lm(
              n,
              t,
              [
                { provide: ei, useValue: this },
                { provide: qr, useValue: this.componentFactoryResolver },
              ],
              oe(n)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(n));
        }
        get(n, t = et.THROW_IF_NOT_FOUND, i = F.Default) {
          return n === et || n === ei || n === qc
            ? this
            : this._r3Injector.get(n, t, i);
        }
        destroy() {
          const n = this._r3Injector;
          !n.destroyed && n.destroy(),
            this.destroyCbs.forEach((t) => t()),
            (this.destroyCbs = null);
        }
        onDestroy(n) {
          this.destroyCbs.push(n);
        }
      }
      class Nd extends Bv {
        constructor(n) {
          super(),
            (this.moduleType = n),
            null !== Wt(n) &&
              (function kA(e) {
                const n = new Set();
                !(function t(i) {
                  const r = Wt(i, !0),
                    o = r.id;
                  null !== o &&
                    ((function jv(e, n, t) {
                      if (n && n !== t)
                        throw new Error(
                          `Duplicate module registered for ${e} - ${oe(
                            n
                          )} vs ${oe(n.name)}`
                        );
                    })(o, Zr.get(o), i),
                    Zr.set(o, i));
                  const s = In(r.imports);
                  for (const a of s) n.has(a) || (n.add(a), t(a));
                })(e);
              })(n);
        }
        create(n) {
          return new $v(this.moduleType, n);
        }
      }
      function Uv(e, n, t, i, r, o) {
        const s = n + t;
        return ft(e, s, r)
          ? (function Rn(e, n, t) {
              return (e[n] = t);
            })(e, s + 1, o ? i.call(o, r) : i(r))
          : (function is(e, n) {
              const t = e[n];
              return t === V ? void 0 : t;
            })(e, s + 1);
      }
      function Jv(e, n, t) {
        const i = e + 20,
          r = b(),
          o = (function gr(e, n) {
            return e[n];
          })(r, i);
        return (function rs(e, n) {
          return e[1].data[n].pure;
        })(r, i)
          ? Uv(
              r,
              (function _t() {
                const e = P.lFrame;
                let n = e.bindingRootIndex;
                return (
                  -1 === n &&
                    (n = e.bindingRootIndex = e.tView.bindingStartIndex),
                  n
                );
              })(),
              n,
              o.transform,
              t,
              o
            )
          : o.transform(t);
      }
      function Td(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const U = class qA extends Ae {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, i) {
          var r, o, s;
          let a = n,
            l = t || (() => null),
            u = i;
          if (n && "object" == typeof n) {
            const d = n;
            (a = null === (r = d.next) || void 0 === r ? void 0 : r.bind(d)),
              (l = null === (o = d.error) || void 0 === o ? void 0 : o.bind(d)),
              (u =
                null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
          }
          this.__isAsync && ((l = Td(l)), a && (a = Td(a)), u && (u = Td(u)));
          const c = super.subscribe({ next: a, error: l, complete: u });
          return n instanceof Ot && n.add(c), c;
        }
      };
      function JA() {
        return this._results[Pr()]();
      }
      class Sd {
        constructor(n = !1) {
          (this._emitDistinctChangesOnly = n),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = Pr(),
            i = Sd.prototype;
          i[t] || (i[t] = JA);
        }
        get changes() {
          return this._changes || (this._changes = new U());
        }
        get(n) {
          return this._results[n];
        }
        map(n) {
          return this._results.map(n);
        }
        filter(n) {
          return this._results.filter(n);
        }
        find(n) {
          return this._results.find(n);
        }
        reduce(n, t) {
          return this._results.reduce(n, t);
        }
        forEach(n) {
          this._results.forEach(n);
        }
        some(n) {
          return this._results.some(n);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(n, t) {
          const i = this;
          i.dirty = !1;
          const r = Jt(n);
          (this._changesDetected = !(function uE(e, n, t) {
            if (e.length !== n.length) return !1;
            for (let i = 0; i < e.length; i++) {
              let r = e[i],
                o = n[i];
              if ((t && ((r = t(r)), (o = t(o))), o !== r)) return !1;
            }
            return !0;
          })(i._results, r, t)) &&
            ((i._results = r),
            (i.length = r.length),
            (i.last = r[this.length - 1]),
            (i.first = r[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      Symbol;
      let xe = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = KA), e;
      })();
      const ZA = xe,
        QA = class extends ZA {
          constructor(n, t, i) {
            super(),
              (this._declarationLView = n),
              (this._declarationTContainer = t),
              (this.elementRef = i);
          }
          createEmbeddedView(n) {
            const t = this._declarationTContainer.tViews,
              i = $o(
                this._declarationLView,
                t,
                n,
                16,
                null,
                t.declTNode,
                null,
                null,
                null,
                null
              );
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const o = this._declarationLView[19];
            return (
              null !== o && (i[19] = o.createEmbeddedView(t)),
              Uo(t, i, n),
              new ts(i)
            );
          }
        };
      function KA() {
        return Za(ze(), b());
      }
      function Za(e, n) {
        return 4 & e.type ? new QA(n, e, Jr(e, n)) : null;
      }
      let gn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = XA), e;
      })();
      function XA() {
        return Kv(ze(), b());
      }
      const eI = gn,
        Zv = class extends eI {
          constructor(n, t, i) {
            super(),
              (this._lContainer = n),
              (this._hostTNode = t),
              (this._hostLView = i);
          }
          get element() {
            return Jr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new yr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = ma(this._hostTNode, this._hostLView);
            if (Wp(n)) {
              const t = vr(n, this._hostLView),
                i = _r(n);
              return new yr(t[1].data[i + 8], t);
            }
            return new yr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = Qv(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(n, t, i) {
            const r = n.createEmbeddedView(t || {});
            return this.insert(r, i), r;
          }
          createComponent(n, t, i, r, o) {
            const s =
              n &&
              !(function So(e) {
                return "function" == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const d = t || {};
              (a = d.index),
                (i = d.injector),
                (r = d.projectableNodes),
                (o = d.ngModuleRef);
            }
            const l = s ? n : new Ed(lt(n)),
              u = i || this.parentInjector;
            if (!o && null == l.ngModule) {
              const f = (s ? u : this.parentInjector).get(ei, null);
              f && (o = f);
            }
            const c = l.create(u, r, void 0, o);
            return this.insert(c.hostView, a), c;
          }
          insert(n, t) {
            const i = n._lView,
              r = i[1];
            if (
              (function Iw(e) {
                return an(e[3]);
              })(i)
            ) {
              const c = this.indexOf(n);
              if (-1 !== c) this.detach(c);
              else {
                const d = i[3],
                  f = new Zv(d, d[6], d[3]);
                f.detach(f.indexOf(n));
              }
            }
            const o = this._adjustIndex(t),
              s = this._lContainer;
            !(function kN(e, n, t, i) {
              const r = 10 + i,
                o = t.length;
              i > 0 && (t[r - 1][4] = n),
                i < o - 10
                  ? ((n[4] = t[r]), tg(t, 10 + i, n))
                  : (t.push(n), (n[4] = null)),
                (n[3] = t);
              const s = n[17];
              null !== s &&
                t !== s &&
                (function FN(e, n) {
                  const t = e[9];
                  n[16] !== n[3][3][16] && (e[2] = !0),
                    null === t ? (e[9] = [n]) : t.push(n);
                })(s, n);
              const a = n[19];
              null !== a && a.insertView(e), (n[2] |= 128);
            })(r, i, s, o);
            const a = Ec(o, s),
              l = i[H],
              u = Sa(l, s[7]);
            return (
              null !== u &&
                (function RN(e, n, t, i, r, o) {
                  (i[0] = r), (i[6] = n), Ho(e, i, t, 1, r, o);
                })(r, s[6], l, i, u, a),
              n.attachToViewContainerRef(),
              tg(Ad(s), o, n),
              n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = Qv(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              i = Dc(this._lContainer, t);
            i && (ya(Ad(this._lContainer), t), Vg(i[1], i));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              i = Dc(this._lContainer, t);
            return i && null != ya(Ad(this._lContainer), t) ? new ts(i) : null;
          }
          _adjustIndex(n, t = 0) {
            return null == n ? this.length + t : n;
          }
        };
      function Qv(e) {
        return e[8];
      }
      function Ad(e) {
        return e[8] || (e[8] = []);
      }
      function Kv(e, n) {
        let t;
        const i = n[e.index];
        if (an(i)) t = i;
        else {
          let r;
          if (8 & e.type) r = He(i);
          else {
            const o = n[H];
            r = o.createComment("");
            const s = qt(e, n);
            ji(
              o,
              Sa(o, s),
              r,
              (function jN(e, n) {
                return Ie(e) ? e.nextSibling(n) : n.nextSibling;
              })(o, s),
              !1
            );
          }
          (n[e.index] = t = Tm(i, n, r, e)), ka(n, t);
        }
        return new Zv(t, e, n);
      }
      class Id {
        constructor(n) {
          (this.queryList = n), (this.matches = null);
        }
        clone() {
          return new Id(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Od {
        constructor(n = []) {
          this.queries = n;
        }
        createEmbeddedView(n) {
          const t = n.queries;
          if (null !== t) {
            const i =
                null !== n.contentQueries ? n.contentQueries[0] : t.length,
              r = [];
            for (let o = 0; o < i; o++) {
              const s = t.getByIndex(o);
              r.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new Od(r);
          }
          return null;
        }
        insertView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        detachView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        dirtyQueriesWithMatches(n) {
          for (let t = 0; t < this.queries.length; t++)
            null !== iy(n, t).matches && this.queries[t].setDirty();
        }
      }
      class Xv {
        constructor(n, t, i = null) {
          (this.predicate = n), (this.flags = t), (this.read = i);
        }
      }
      class Rd {
        constructor(n = []) {
          this.queries = n;
        }
        elementStart(n, t) {
          for (let i = 0; i < this.queries.length; i++)
            this.queries[i].elementStart(n, t);
        }
        elementEnd(n) {
          for (let t = 0; t < this.queries.length; t++)
            this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
          let t = null;
          for (let i = 0; i < this.length; i++) {
            const r = null !== t ? t.length : 0,
              o = this.getByIndex(i).embeddedTView(n, r);
            o &&
              ((o.indexInDeclarationView = i),
              null !== t ? t.push(o) : (t = [o]));
          }
          return null !== t ? new Rd(t) : null;
        }
        template(n, t) {
          for (let i = 0; i < this.queries.length; i++)
            this.queries[i].template(n, t);
        }
        getByIndex(n) {
          return this.queries[n];
        }
        get length() {
          return this.queries.length;
        }
        track(n) {
          this.queries.push(n);
        }
      }
      class xd {
        constructor(n, t = -1) {
          (this.metadata = n),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(n, t) {
          this.isApplyingToNode(t) && this.matchTNode(n, t);
        }
        elementEnd(n) {
          this._declarationNodeIndex === n.index &&
            (this._appliesToNextNode = !1);
        }
        template(n, t) {
          this.elementStart(n, t);
        }
        embeddedTView(n, t) {
          return this.isApplyingToNode(n)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-n.index, t),
              new xd(this.metadata))
            : null;
        }
        isApplyingToNode(n) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let i = n.parent;
            for (; null !== i && 8 & i.type && i.index !== t; ) i = i.parent;
            return t === (null !== i ? i.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(n, t) {
          const i = this.metadata.predicate;
          if (Array.isArray(i))
            for (let r = 0; r < i.length; r++) {
              const o = i[r];
              this.matchTNodeWithReadOption(n, t, iI(t, o)),
                this.matchTNodeWithReadOption(n, t, va(t, n, o, !1, !1));
            }
          else
            i === xe
              ? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
              : this.matchTNodeWithReadOption(n, t, va(t, n, i, !1, !1));
        }
        matchTNodeWithReadOption(n, t, i) {
          if (null !== i) {
            const r = this.metadata.read;
            if (null !== r)
              if (r === _e || r === gn || (r === xe && 4 & t.type))
                this.addMatch(t.index, -2);
              else {
                const o = va(t, n, r, !1, !1);
                null !== o && this.addMatch(t.index, o);
              }
            else this.addMatch(t.index, i);
          }
        }
        addMatch(n, t) {
          null === this.matches
            ? (this.matches = [n, t])
            : this.matches.push(n, t);
        }
      }
      function iI(e, n) {
        const t = e.localNames;
        if (null !== t)
          for (let i = 0; i < t.length; i += 2) if (t[i] === n) return t[i + 1];
        return null;
      }
      function oI(e, n, t, i) {
        return -1 === t
          ? (function rI(e, n) {
              return 11 & e.type ? Jr(e, n) : 4 & e.type ? Za(e, n) : null;
            })(n, e)
          : -2 === t
          ? (function sI(e, n, t) {
              return t === _e
                ? Jr(n, e)
                : t === xe
                ? Za(n, e)
                : t === gn
                ? Kv(n, e)
                : void 0;
            })(e, n, i)
          : Mo(e, e[1], t, n);
      }
      function ey(e, n, t, i) {
        const r = n[19].queries[i];
        if (null === r.matches) {
          const o = e.data,
            s = t.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : oI(n, o[u], s[l + 1], t.metadata.read));
          }
          r.matches = a;
        }
        return r.matches;
      }
      function Pd(e, n, t, i) {
        const r = e.queries.getByIndex(t),
          o = r.matches;
        if (null !== o) {
          const s = ey(e, n, r, t);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) i.push(s[a / 2]);
            else {
              const u = o[a + 1],
                c = n[-l];
              for (let d = 10; d < c.length; d++) {
                const f = c[d];
                f[17] === f[3] && Pd(f[1], f, u, i);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  Pd(h[1], h, u, i);
                }
              }
            }
          }
        }
        return i;
      }
      function Me(e) {
        const n = b(),
          t = ee(),
          i = Fp();
        Gu(i + 1);
        const r = iy(t, i);
        if (e.dirty && Ip(n) === (2 == (2 & r.metadata.flags))) {
          if (null === r.matches) e.reset([]);
          else {
            const o = r.crossesNgTemplate ? Pd(t, n, i, []) : ey(t, n, r, i);
            e.reset(o, EA), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function kd(e, n, t) {
        const i = ee();
        i.firstCreatePass &&
          ((function ny(e, n, t) {
            null === e.queries && (e.queries = new Rd()),
              e.queries.track(new xd(n, t));
          })(i, new Xv(e, n, t), -1),
          2 == (2 & n) && (i.staticViewQueries = !0)),
          (function ty(e, n, t) {
            const i = new Sd(4 == (4 & t));
            ym(e, n, i, i.destroy),
              null === n[19] && (n[19] = new Od()),
              n[19].queries.push(new Id(i));
          })(i, b(), n);
      }
      function iy(e, n) {
        return e.queries.getByIndex(n);
      }
      function Xa(...e) {}
      const Hd = new W("Application Initializer");
      let $d = (() => {
        class e {
          constructor(t) {
            (this.appInits = t),
              (this.resolve = Xa),
              (this.reject = Xa),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((i, r) => {
                (this.resolve = i), (this.reject = r);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              i = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let r = 0; r < this.appInits.length; r++) {
                const o = this.appInits[r]();
                if (Yo(o)) t.push(o);
                else if (cd(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  t.push(s);
                }
              }
            Promise.all(t)
              .then(() => {
                i();
              })
              .catch((r) => {
                this.reject(r);
              }),
              0 === t.length && i(),
              (this.initialized = !0);
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(Hd, 8));
          }),
          (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
          e
        );
      })();
      const ss = new W("AppId", {
        providedIn: "root",
        factory: function by() {
          return `${Ud()}${Ud()}${Ud()}`;
        },
      });
      function Ud() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Dy = new W("Platform Initializer"),
        el = new W("Platform ID"),
        Cy = new W("appBootstrapListener");
      let wy = (() => {
        class e {
          log(t) {
            console.log(t);
          }
          warn(t) {
            console.warn(t);
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      const Di = new W("LocaleId", {
        providedIn: "root",
        factory: () =>
          CE(Di, F.Optional | F.SkipSelf) ||
          (function NI() {
            return ("undefined" != typeof $localize && $localize.locale) || $a;
          })(),
      });
      class TI {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let Ey = (() => {
        class e {
          compileModuleSync(t) {
            return new Nd(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const i = this.compileModuleSync(t),
              o = In(Wt(t).declarations).reduce((s, a) => {
                const l = lt(a);
                return l && s.push(new Ed(l)), s;
              }, []);
            return new TI(i, o);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
          e
        );
      })();
      const AI = (() => Promise.resolve(0))();
      function Gd(e) {
        "undefined" == typeof Zone
          ? AI.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class we {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: i = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new U(!1)),
            (this.onMicrotaskEmpty = new U(!1)),
            (this.onStable = new U(!1)),
            (this.onError = new U(!1)),
            "undefined" == typeof Zone)
          )
            throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const r = this;
          (r._nesting = 0),
            (r._outer = r._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n &&
              Zone.longStackTraceZoneSpec &&
              (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)),
            (r.shouldCoalesceEventChangeDetection = !i && t),
            (r.shouldCoalesceRunChangeDetection = i),
            (r.lastRequestAnimationFrameId = -1),
            (r.nativeRequestAnimationFrame = (function II() {
              let e = ue.requestAnimationFrame,
                n = ue.cancelAnimationFrame;
              if ("undefined" != typeof Zone && e && n) {
                const t = e[Zone.__symbol__("OriginalDelegate")];
                t && (e = t);
                const i = n[Zone.__symbol__("OriginalDelegate")];
                i && (n = i);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: n,
              };
            })().nativeRequestAnimationFrame),
            (function xI(e) {
              const n = () => {
                !(function RI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(ue, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                zd(e),
                                (e.isCheckStableRunning = !0),
                                Wd(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    zd(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, i, r, o, s, a) => {
                  try {
                    return Ny(e), t.invokeTask(r, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      My(e);
                  }
                },
                onInvoke: (t, i, r, o, s, a, l) => {
                  try {
                    return Ny(e), t.invoke(r, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), My(e);
                  }
                },
                onHasTask: (t, i, r, o) => {
                  t.hasTask(r, o),
                    i === r &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask),
                          zd(e),
                          Wd(e))
                        : "macroTask" == o.change &&
                          (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (t, i, r, o) => (
                  t.handleError(r, o),
                  e.runOutsideAngular(() => e.onError.emit(o)),
                  !1
                ),
              });
            })(r);
        }
        static isInAngularZone() {
          return (
            "undefined" != typeof Zone &&
            !0 === Zone.current.get("isAngularZone")
          );
        }
        static assertInAngularZone() {
          if (!we.isInAngularZone())
            throw new Error("Expected to be in Angular Zone, but it is not!");
        }
        static assertNotInAngularZone() {
          if (we.isInAngularZone())
            throw new Error("Expected to not be in Angular Zone, but it is!");
        }
        run(n, t, i) {
          return this._inner.run(n, t, i);
        }
        runTask(n, t, i, r) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + r, n, OI, Xa, Xa);
          try {
            return o.runTask(s, t, i);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(n, t, i) {
          return this._inner.runGuarded(n, t, i);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const OI = {};
      function Wd(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function zd(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Ny(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function My(e) {
        e._nesting--, Wd(e);
      }
      class PI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new U()),
            (this.onMicrotaskEmpty = new U()),
            (this.onStable = new U()),
            (this.onError = new U());
        }
        run(n, t, i) {
          return n.apply(t, i);
        }
        runGuarded(n, t, i) {
          return n.apply(t, i);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, i, r) {
          return n.apply(t, i);
        }
      }
      let Yd = (() => {
          class e {
            constructor(t) {
              (this._ngZone = t),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    "undefined" == typeof Zone
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      we.assertNotInAngularZone(),
                        Gd(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Gd(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (i) =>
                    !i.updateCb ||
                    !i.updateCb(t) ||
                    (clearTimeout(i.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, i, r) {
              let o = -1;
              i &&
                i > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    t(this._didWork, this.getPendingTasks());
                }, i)),
                this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: r });
            }
            whenStable(t, i, r) {
              if (r && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, i, r), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(t, i, r) {
              return [];
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(we));
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })(),
        Ty = (() => {
          class e {
            constructor() {
              (this._applications = new Map()), qd.addToWindow(this);
            }
            registerApplication(t, i) {
              this._applications.set(t, i);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, i = !0) {
              return qd.findTestabilityInTree(this, t, i);
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })();
      class kI {
        addToWindow(n) {}
        findTestabilityInTree(n, t, i) {
          return null;
        }
      }
      let mn,
        qd = new kI();
      const Sy = new W("AllowMultipleToken");
      class Ay {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function Iy(e, n, t = []) {
        const i = `Platform: ${n}`,
          r = new W(i);
        return (o = []) => {
          let s = Oy();
          if (!s || s.injector.get(Sy, !1))
            if (e) e(t.concat(o).concat({ provide: r, useValue: !0 }));
            else {
              const a = t
                .concat(o)
                .concat(
                  { provide: r, useValue: !0 },
                  { provide: Jc, useValue: "platform" }
                );
              !(function BI(e) {
                if (mn && !mn.destroyed && !mn.injector.get(Sy, !1))
                  throw new X(400, "");
                mn = e.get(Ry);
                const n = e.get(Dy, null);
                n && n.forEach((t) => t());
              })(et.create({ providers: a, name: i }));
            }
          return (function jI(e) {
            const n = Oy();
            if (!n) throw new X(401, "");
            return n;
          })();
        };
      }
      function Oy() {
        return mn && !mn.destroyed ? mn : null;
      }
      let Ry = (() => {
        class e {
          constructor(t) {
            (this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, i) {
            const a = (function HI(e, n) {
                let t;
                return (
                  (t =
                    "noop" === e
                      ? new PI()
                      : ("zone.js" === e ? void 0 : e) ||
                        new we({
                          enableLongStackTrace: !1,
                          shouldCoalesceEventChangeDetection: !!(null == n
                            ? void 0
                            : n.ngZoneEventCoalescing),
                          shouldCoalesceRunChangeDetection: !!(null == n
                            ? void 0
                            : n.ngZoneRunCoalescing),
                        })),
                  t
                );
              })(i ? i.ngZone : void 0, {
                ngZoneEventCoalescing: (i && i.ngZoneEventCoalescing) || !1,
                ngZoneRunCoalescing: (i && i.ngZoneRunCoalescing) || !1,
              }),
              l = [{ provide: we, useValue: a }];
            return a.run(() => {
              const u = et.create({
                  providers: l,
                  parent: this.injector,
                  name: t.moduleType.name,
                }),
                c = t.create(u),
                d = c.injector.get(Bo, null);
              if (!d) throw new X(402, "");
              return (
                a.runOutsideAngular(() => {
                  const f = a.onError.subscribe({
                    next: (h) => {
                      d.handleError(h);
                    },
                  });
                  c.onDestroy(() => {
                    Jd(this._modules, c), f.unsubscribe();
                  });
                }),
                (function $I(e, n, t) {
                  try {
                    const i = t();
                    return Yo(i)
                      ? i.catch((r) => {
                          throw (
                            (n.runOutsideAngular(() => e.handleError(r)), r)
                          );
                        })
                      : i;
                  } catch (i) {
                    throw (n.runOutsideAngular(() => e.handleError(i)), i);
                  }
                })(d, a, () => {
                  const f = c.injector.get($d);
                  return (
                    f.runInitializers(),
                    f.donePromise.then(
                      () => (
                        (function TS(e) {
                          (function xt(e, n) {
                            null == e && De(n, e, null, "!=");
                          })(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (dv = e.toLowerCase().replace(/_/g, "-"));
                        })(c.injector.get(Di, $a) || $a),
                        this._moduleDoBootstrap(c),
                        c
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, i = []) {
            const r = xy({}, i);
            return (function LI(e, n, t) {
              const i = new Nd(t);
              return Promise.resolve(i);
            })(0, 0, t).then((o) => this.bootstrapModuleFactory(o, r));
          }
          _moduleDoBootstrap(t) {
            const i = t.injector.get(tl);
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach((r) => i.bootstrap(r));
            else {
              if (!t.instance.ngDoBootstrap) throw new X(403, "");
              t.instance.ngDoBootstrap(i);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new X(404, "");
            this._modules.slice().forEach((t) => t.destroy()),
              this._destroyListeners.forEach((t) => t()),
              (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(et));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      function xy(e, n) {
        return Array.isArray(n)
          ? n.reduce(xy, e)
          : Object.assign(Object.assign({}, e), n);
      }
      let tl = (() => {
        class e {
          constructor(t, i, r, o, s) {
            (this._zone = t),
              (this._injector = i),
              (this._exceptionHandler = r),
              (this._componentFactoryResolver = o),
              (this._initStatus = s),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const a = new ge((u) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    u.next(this._stable), u.complete();
                  });
              }),
              l = new ge((u) => {
                let c;
                this._zone.runOutsideAngular(() => {
                  c = this._zone.onStable.subscribe(() => {
                    we.assertNotInAngularZone(),
                      Gd(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), u.next(!0));
                      });
                  });
                });
                const d = this._zone.onUnstable.subscribe(() => {
                  we.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        u.next(!1);
                      }));
                });
                return () => {
                  c.unsubscribe(), d.unsubscribe();
                };
              });
            this.isStable = (function JC(...e) {
              const n = _o(e),
                t = (function $C(e, n) {
                  return "number" == typeof vu(e) ? e.pop() : n;
                })(e, 1 / 0),
                i = e;
              return i.length
                ? 1 === i.length
                  ? st(i[0])
                  : mo(t)(Ke(i, n))
                : rn;
            })(
              a,
              l.pipe(
                (function ZC(e = {}) {
                  const {
                    connector: n = () => new Ae(),
                    resetOnError: t = !0,
                    resetOnComplete: i = !0,
                    resetOnRefCountZero: r = !0,
                  } = e;
                  return (o) => {
                    let s = null,
                      a = null,
                      l = null,
                      u = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        null == a || a.unsubscribe(), (a = null);
                      },
                      h = () => {
                        f(), (s = l = null), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), null == g || g.unsubscribe();
                      };
                    return Pe((g, v) => {
                      u++, !d && !c && f();
                      const y = (l = null != l ? l : n());
                      v.add(() => {
                        u--, 0 === u && !d && !c && (a = yu(p, r));
                      }),
                        y.subscribe(v),
                        s ||
                          ((s = new qs({
                            next: (m) => y.next(m),
                            error: (m) => {
                              (d = !0), f(), (a = yu(h, t, m)), y.error(m);
                            },
                            complete: () => {
                              (c = !0), f(), (a = yu(h, i)), y.complete();
                            },
                          })),
                          Ke(g).subscribe(s));
                    })(o);
                  };
                })()
              )
            );
          }
          bootstrap(t, i) {
            if (!this._initStatus.done) throw new X(405, "");
            let r;
            (r =
              t instanceof kv
                ? t
                : this._componentFactoryResolver.resolveComponentFactory(t)),
              this.componentTypes.push(r.componentType);
            const o = (function VI(e) {
                return e.isBoundToModule;
              })(r)
                ? void 0
                : this._injector.get(ei),
              a = r.create(et.NULL, [], i || r.selector, o),
              l = a.location.nativeElement,
              u = a.injector.get(Yd, null),
              c = u && a.injector.get(Ty);
            return (
              u && c && c.registerApplication(l, u),
              a.onDestroy(() => {
                this.detachView(a.hostView),
                  Jd(this.components, a),
                  c && c.unregisterApplication(l);
              }),
              this._loadComponent(a),
              a
            );
          }
          tick() {
            if (this._runningTick) throw new X(101, "");
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(t)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const i = t;
            this._views.push(i), i.attachToAppRef(this);
          }
          detachView(t) {
            const i = t;
            Jd(this._views, i), i.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView),
              this.tick(),
              this.components.push(t),
              this._injector
                .get(Cy, [])
                .concat(this._bootstrapListeners)
                .forEach((r) => r(t));
          }
          ngOnDestroy() {
            this._views.slice().forEach((t) => t.destroy()),
              this._onMicrotaskEmptySubscription.unsubscribe();
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(we), T(et), T(Bo), T(qr), T($d));
          }),
          (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
          e
        );
      })();
      function Jd(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      let ky = !0,
        _n = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = WI), e;
        })();
      function WI(e) {
        return (function zI(e, n, t) {
          if (ia(e) && !t) {
            const i = kt(e.index, n);
            return new ts(i, i);
          }
          return 47 & e.type ? new ts(n[16], n) : null;
        })(ze(), b(), 16 == (16 & e));
      }
      const oO = Iy(null, "core", [
        { provide: el, useValue: "unknown" },
        { provide: Ry, deps: [et] },
        { provide: Ty, deps: [] },
        { provide: wy, deps: [] },
      ]);
      let sO = (() => {
          class e {
            constructor(t) {}
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(tl));
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })(),
        ol = null;
      function kn() {
        return ol;
      }
      const nt = new W("DocumentToken");
      let zi = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??prov = x({
            token: e,
            factory: function () {
              return (function cO() {
                return T(zy);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const dO = new W("Location Initialized");
      let zy = (() => {
        class e extends zi {
          constructor(t) {
            super(), (this._doc = t), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return kn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const i = kn().getGlobalEventTarget(this._doc, "window");
            return (
              i.addEventListener("popstate", t, !1),
              () => i.removeEventListener("popstate", t)
            );
          }
          onHashChange(t) {
            const i = kn().getGlobalEventTarget(this._doc, "window");
            return (
              i.addEventListener("hashchange", t, !1),
              () => i.removeEventListener("hashchange", t)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(t) {
            this.location.pathname = t;
          }
          pushState(t, i, r) {
            Yy() ? this._history.pushState(t, i, r) : (this.location.hash = r);
          }
          replaceState(t, i, r) {
            Yy()
              ? this._history.replaceState(t, i, r)
              : (this.location.hash = r);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(nt));
          }),
          (e.??prov = x({
            token: e,
            factory: function () {
              return (function fO() {
                return new zy(T(nt));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function Yy() {
        return !!window.history.pushState;
      }
      function ef(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith("/") && t++,
          n.startsWith("/") && t++,
          2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
        );
      }
      function qy(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function ni(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Kr = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??prov = x({
            token: e,
            factory: function () {
              return (function hO(e) {
                const n = T(nt).location;
                return new Jy(T(zi), (n && n.origin) || "");
              })();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const tf = new W("appBaseHref");
      let Jy = (() => {
          class e extends Kr {
            constructor(t, i) {
              if (
                (super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                null == i && (i = this._platformLocation.getBaseHrefFromDOM()),
                null == i)
              )
                throw new Error(
                  "No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document."
                );
              this._baseHref = i;
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return ef(this._baseHref, t);
            }
            path(t = !1) {
              const i =
                  this._platformLocation.pathname +
                  ni(this._platformLocation.search),
                r = this._platformLocation.hash;
              return r && t ? `${i}${r}` : i;
            }
            pushState(t, i, r, o) {
              const s = this.prepareExternalUrl(r + ni(o));
              this._platformLocation.pushState(t, i, s);
            }
            replaceState(t, i, r, o) {
              const s = this.prepareExternalUrl(r + ni(o));
              this._platformLocation.replaceState(t, i, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(t = 0) {
              var i, r;
              null === (r = (i = this._platformLocation).historyGo) ||
                void 0 === r ||
                r.call(i, t);
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(zi), T(tf, 8));
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })(),
        pO = (() => {
          class e extends Kr {
            constructor(t, i) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != i && (this._baseHref = i);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let i = this._platformLocation.hash;
              return null == i && (i = "#"), i.length > 0 ? i.substring(1) : i;
            }
            prepareExternalUrl(t) {
              const i = ef(this._baseHref, t);
              return i.length > 0 ? "#" + i : i;
            }
            pushState(t, i, r, o) {
              let s = this.prepareExternalUrl(r + ni(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, i, s);
            }
            replaceState(t, i, r, o) {
              let s = this.prepareExternalUrl(r + ni(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, i, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(t = 0) {
              var i, r;
              null === (r = (i = this._platformLocation).historyGo) ||
                void 0 === r ||
                r.call(i, t);
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(zi), T(tf, 8));
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })(),
        nf = (() => {
          class e {
            constructor(t, i) {
              (this._subject = new U()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = t);
              const r = this._platformStrategy.getBaseHref();
              (this._platformLocation = i),
                (this._baseHref = qy(Zy(r))),
                this._platformStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            path(t = !1) {
              return this.normalize(this._platformStrategy.path(t));
            }
            getState() {
              return this._platformLocation.getState();
            }
            isCurrentPathEqualTo(t, i = "") {
              return this.path() == this.normalize(t + ni(i));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function mO(e, n) {
                  return e && n.startsWith(e) ? n.substring(e.length) : n;
                })(this._baseHref, Zy(t))
              );
            }
            prepareExternalUrl(t) {
              return (
                t && "/" !== t[0] && (t = "/" + t),
                this._platformStrategy.prepareExternalUrl(t)
              );
            }
            go(t, i = "", r = null) {
              this._platformStrategy.pushState(r, "", t, i),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + ni(i)),
                  r
                );
            }
            replaceState(t, i = "", r = null) {
              this._platformStrategy.replaceState(r, "", t, i),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + ni(i)),
                  r
                );
            }
            forward() {
              this._platformStrategy.forward();
            }
            back() {
              this._platformStrategy.back();
            }
            historyGo(t = 0) {
              var i, r;
              null === (r = (i = this._platformStrategy).historyGo) ||
                void 0 === r ||
                r.call(i, t);
            }
            onUrlChange(t) {
              this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((i) => {
                    this._notifyUrlChangeListeners(i.url, i.state);
                  }));
            }
            _notifyUrlChangeListeners(t = "", i) {
              this._urlChangeListeners.forEach((r) => r(t, i));
            }
            subscribe(t, i, r) {
              return this._subject.subscribe({
                next: t,
                error: i,
                complete: r,
              });
            }
          }
          return (
            (e.normalizeQueryParams = ni),
            (e.joinWithSlash = ef),
            (e.stripTrailingSlash = qy),
            (e.??fac = function (t) {
              return new (t || e)(T(Kr), T(zi));
            }),
            (e.??prov = x({
              token: e,
              factory: function () {
                return (function gO() {
                  return new nf(T(Kr), T(zi));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function Zy(e) {
        return e.replace(/\/index.html$/, "");
      }
      var It = (() => (
          ((It = It || {})[(It.Decimal = 0)] = "Decimal"),
          (It[(It.Percent = 1)] = "Percent"),
          (It[(It.Currency = 2)] = "Currency"),
          (It[(It.Scientific = 3)] = "Scientific"),
          It
        ))(),
        I = (() => (
          ((I = I || {})[(I.Decimal = 0)] = "Decimal"),
          (I[(I.Group = 1)] = "Group"),
          (I[(I.List = 2)] = "List"),
          (I[(I.PercentSign = 3)] = "PercentSign"),
          (I[(I.PlusSign = 4)] = "PlusSign"),
          (I[(I.MinusSign = 5)] = "MinusSign"),
          (I[(I.Exponential = 6)] = "Exponential"),
          (I[(I.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (I[(I.PerMille = 8)] = "PerMille"),
          (I[(I.Infinity = 9)] = "Infinity"),
          (I[(I.NaN = 10)] = "NaN"),
          (I[(I.TimeSeparator = 11)] = "TimeSeparator"),
          (I[(I.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (I[(I.CurrencyGroup = 13)] = "CurrencyGroup"),
          I
        ))();
      function Qt(e, n) {
        const t = bt(e),
          i = t[N.NumberSymbols][n];
        if (void 0 === i) {
          if (n === I.CurrencyDecimal) return t[N.NumberSymbols][I.Decimal];
          if (n === I.CurrencyGroup) return t[N.NumberSymbols][I.Group];
        }
        return i;
      }
      const $O = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
      function ff(e) {
        const n = parseInt(e);
        if (isNaN(n))
          throw new Error("Invalid integer literal when parsing " + e);
        return n;
      }
      let Xr = (() => {
        class e {
          constructor(t, i) {
            (this._viewContainer = t),
              (this._context = new iR()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = i);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t),
              this._updateView();
          }
          set ngIfThen(t) {
            a0("ngIfThen", t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(t) {
            a0("ngIfElse", t),
              (this._elseTemplateRef = t),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(t, i) {
            return !0;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(_(gn), _(xe));
          }),
          (e.??dir = C({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
          })),
          e
        );
      })();
      class iR {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function a0(e, n) {
        if (n && !n.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${oe(n)}'.`
          );
      }
      let c0 = (() => {
        class e {
          constructor(t) {
            this._locale = t;
          }
          transform(t, i, r) {
            if (
              !(function mf(e) {
                return !(null == e || "" === e || e != e);
              })(t)
            )
              return null;
            r = r || this._locale;
            try {
              return (function YO(e, n, t) {
                return (function cf(e, n, t, i, r, o, s = !1) {
                  let a = "",
                    l = !1;
                  if (isFinite(e)) {
                    let u = (function ZO(e) {
                      let i,
                        r,
                        o,
                        s,
                        a,
                        n = Math.abs(e) + "",
                        t = 0;
                      for (
                        (r = n.indexOf(".")) > -1 && (n = n.replace(".", "")),
                          (o = n.search(/e/i)) > 0
                            ? (r < 0 && (r = o),
                              (r += +n.slice(o + 1)),
                              (n = n.substring(0, o)))
                            : r < 0 && (r = n.length),
                          o = 0;
                        "0" === n.charAt(o);
                        o++
                      );
                      if (o === (a = n.length)) (i = [0]), (r = 1);
                      else {
                        for (a--; "0" === n.charAt(a); ) a--;
                        for (r -= o, i = [], s = 0; o <= a; o++, s++)
                          i[s] = Number(n.charAt(o));
                      }
                      return (
                        r > 22 && ((i = i.splice(0, 21)), (t = r - 1), (r = 1)),
                        { digits: i, exponent: t, integerLen: r }
                      );
                    })(e);
                    s &&
                      (u = (function JO(e) {
                        if (0 === e.digits[0]) return e;
                        const n = e.digits.length - e.integerLen;
                        return (
                          e.exponent
                            ? (e.exponent += 2)
                            : (0 === n
                                ? e.digits.push(0, 0)
                                : 1 === n && e.digits.push(0),
                              (e.integerLen += 2)),
                          e
                        );
                      })(u));
                    let c = n.minInt,
                      d = n.minFrac,
                      f = n.maxFrac;
                    if (o) {
                      const m = o.match($O);
                      if (null === m)
                        throw new Error(`${o} is not a valid digit info`);
                      const D = m[1],
                        w = m[3],
                        M = m[5];
                      null != D && (c = ff(D)),
                        null != w && (d = ff(w)),
                        null != M ? (f = ff(M)) : null != w && d > f && (f = d);
                    }
                    !(function QO(e, n, t) {
                      if (n > t)
                        throw new Error(
                          `The minimum number of digits after fraction (${n}) is higher than the maximum (${t}).`
                        );
                      let i = e.digits,
                        r = i.length - e.integerLen;
                      const o = Math.min(Math.max(n, r), t);
                      let s = o + e.integerLen,
                        a = i[s];
                      if (s > 0) {
                        i.splice(Math.max(e.integerLen, s));
                        for (let d = s; d < i.length; d++) i[d] = 0;
                      } else {
                        (r = Math.max(0, r)),
                          (e.integerLen = 1),
                          (i.length = Math.max(1, (s = o + 1))),
                          (i[0] = 0);
                        for (let d = 1; d < s; d++) i[d] = 0;
                      }
                      if (a >= 5)
                        if (s - 1 < 0) {
                          for (let d = 0; d > s; d--)
                            i.unshift(0), e.integerLen++;
                          i.unshift(1), e.integerLen++;
                        } else i[s - 1]++;
                      for (; r < Math.max(0, o); r++) i.push(0);
                      let l = 0 !== o;
                      const u = n + e.integerLen,
                        c = i.reduceRight(function (d, f, h, p) {
                          return (
                            (p[h] = (f += d) < 10 ? f : f - 10),
                            l && (0 === p[h] && h >= u ? p.pop() : (l = !1)),
                            f >= 10 ? 1 : 0
                          );
                        }, 0);
                      c && (i.unshift(c), e.integerLen++);
                    })(u, d, f);
                    let h = u.digits,
                      p = u.integerLen;
                    const g = u.exponent;
                    let v = [];
                    for (l = h.every((m) => !m); p < c; p++) h.unshift(0);
                    for (; p < 0; p++) h.unshift(0);
                    p > 0 ? (v = h.splice(p, h.length)) : ((v = h), (h = [0]));
                    const y = [];
                    for (
                      h.length >= n.lgSize &&
                      y.unshift(h.splice(-n.lgSize, h.length).join(""));
                      h.length > n.gSize;

                    )
                      y.unshift(h.splice(-n.gSize, h.length).join(""));
                    h.length && y.unshift(h.join("")),
                      (a = y.join(Qt(t, i))),
                      v.length && (a += Qt(t, r) + v.join("")),
                      g && (a += Qt(t, I.Exponential) + "+" + g);
                  } else a = Qt(t, I.Infinity);
                  return (
                    (a =
                      e < 0 && !l
                        ? n.negPre + a + n.negSuf
                        : n.posPre + a + n.posSuf),
                    a
                  );
                })(
                  e,
                  (function df(e, n = "-") {
                    const t = {
                        minInt: 1,
                        minFrac: 0,
                        maxFrac: 0,
                        posPre: "",
                        posSuf: "",
                        negPre: "",
                        negSuf: "",
                        gSize: 0,
                        lgSize: 0,
                      },
                      i = e.split(";"),
                      r = i[0],
                      o = i[1],
                      s =
                        -1 !== r.indexOf(".")
                          ? r.split(".")
                          : [
                              r.substring(0, r.lastIndexOf("0") + 1),
                              r.substring(r.lastIndexOf("0") + 1),
                            ],
                      a = s[0],
                      l = s[1] || "";
                    t.posPre = a.substr(0, a.indexOf("#"));
                    for (let c = 0; c < l.length; c++) {
                      const d = l.charAt(c);
                      "0" === d
                        ? (t.minFrac = t.maxFrac = c + 1)
                        : "#" === d
                        ? (t.maxFrac = c + 1)
                        : (t.posSuf += d);
                    }
                    const u = a.split(",");
                    if (
                      ((t.gSize = u[1] ? u[1].length : 0),
                      (t.lgSize = u[2] || u[1] ? (u[2] || u[1]).length : 0),
                      o)
                    ) {
                      const c = r.length - t.posPre.length - t.posSuf.length,
                        d = o.indexOf("#");
                      (t.negPre = o.substr(0, d).replace(/'/g, "")),
                        (t.negSuf = o.substr(d + c).replace(/'/g, ""));
                    } else (t.negPre = n + t.posPre), (t.negSuf = t.posSuf);
                    return t;
                  })(
                    (function rf(e, n) {
                      return bt(e)[N.NumberFormats][n];
                    })(n, It.Percent),
                    Qt(n, I.MinusSign)
                  ),
                  n,
                  I.Group,
                  I.Decimal,
                  t,
                  !0
                ).replace(new RegExp("%", "g"), Qt(n, I.PercentSign));
              })(
                (function _f(e) {
                  if ("string" == typeof e && !isNaN(Number(e) - parseFloat(e)))
                    return Number(e);
                  if ("number" != typeof e)
                    throw new Error(`${e} is not a number`);
                  return e;
                })(t),
                r,
                i
              );
            } catch (o) {
              throw (function yn(e, n) {
                return new X(2100, "");
              })();
            }
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(_(Di, 16));
          }),
          (e.??pipe = Tt({ name: "percent", type: e, pure: !0 })),
          e
        );
      })();
      let $t = (() => {
        class e {}
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??mod = ce({ type: e })),
          (e.??inj = se({})),
          e
        );
      })();
      let RR = (() => {
        class e {}
        return (
          (e.??prov = x({
            token: e,
            providedIn: "root",
            factory: () => new xR(T(nt), window),
          })),
          e
        );
      })();
      class xR {
        constructor(n, t) {
          (this.document = n), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(n) {
          this.offset = Array.isArray(n) ? () => n : n;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(n) {
          this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
          if (!this.supportsScrolling()) return;
          const t = (function PR(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const i = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let r = i.currentNode;
              for (; r; ) {
                const o = r.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(n) || o.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                r = i.nextNode();
              }
            }
            return null;
          })(this.document, n);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
          if (this.supportScrollRestoration()) {
            const t = this.window.history;
            t && t.scrollRestoration && (t.scrollRestoration = n);
          }
        }
        scrollToElement(n) {
          const t = n.getBoundingClientRect(),
            i = t.left + this.window.pageXOffset,
            r = t.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(i - o[0], r - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const n =
              f0(this.window.history) ||
              f0(Object.getPrototypeOf(this.window.history));
            return !(!n || (!n.writable && !n.set));
          } catch (n) {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch (n) {
            return !1;
          }
        }
      }
      function f0(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class vf extends class FR extends class uO {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function lO(e) {
            ol || (ol = e);
          })(new vf());
        }
        onAndCancel(n, t, i) {
          return (
            n.addEventListener(t, i, !1),
            () => {
              n.removeEventListener(t, i, !1);
            }
          );
        }
        dispatchEvent(n, t) {
          n.dispatchEvent(t);
        }
        remove(n) {
          n.parentNode && n.parentNode.removeChild(n);
        }
        createElement(n, t) {
          return (t = t || this.getDefaultDocument()).createElement(n);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
          return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
          return "window" === t
            ? window
            : "document" === t
            ? n
            : "body" === t
            ? n.body
            : null;
        }
        getBaseHref(n) {
          const t = (function LR() {
            return (
              (fs = fs || document.querySelector("base")),
              fs ? fs.getAttribute("href") : null
            );
          })();
          return null == t
            ? null
            : (function VR(e) {
                (gl = gl || document.createElement("a")),
                  gl.setAttribute("href", e);
                const n = gl.pathname;
                return "/" === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          fs = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return (function XO(e, n) {
            n = encodeURIComponent(n);
            for (const t of e.split(";")) {
              const i = t.indexOf("="),
                [r, o] = -1 == i ? [t, ""] : [t.slice(0, i), t.slice(i + 1)];
              if (r.trim() === n) return decodeURIComponent(o);
            }
            return null;
          })(document.cookie, n);
        }
      }
      let gl,
        fs = null;
      const h0 = new W("TRANSITION_ID"),
        jR = [
          {
            provide: Hd,
            useFactory: function BR(e, n, t) {
              return () => {
                t.get($d).donePromise.then(() => {
                  const i = kn(),
                    r = n.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < r.length; o++) i.remove(r[o]);
                });
              };
            },
            deps: [h0, nt, et],
            multi: !0,
          },
        ];
      class yf {
        static init() {
          !(function FI(e) {
            qd = e;
          })(new yf());
        }
        addToWindow(n) {
          (ue.getAngularTestability = (i, r = !0) => {
            const o = n.findTestabilityInTree(i, r);
            if (null == o)
              throw new Error("Could not find testability for element.");
            return o;
          }),
            (ue.getAllAngularTestabilities = () => n.getAllTestabilities()),
            (ue.getAllAngularRootElements = () => n.getAllRootElements()),
            ue.frameworkStabilizers || (ue.frameworkStabilizers = []),
            ue.frameworkStabilizers.push((i) => {
              const r = ue.getAllAngularTestabilities();
              let o = r.length,
                s = !1;
              const a = function (l) {
                (s = s || l), o--, 0 == o && i(s);
              };
              r.forEach(function (l) {
                l.whenStable(a);
              });
            });
        }
        findTestabilityInTree(n, t, i) {
          if (null == t) return null;
          const r = n.getTestability(t);
          return null != r
            ? r
            : i
            ? kn().isShadowRoot(t)
              ? this.findTestabilityInTree(n, t.host, !0)
              : this.findTestabilityInTree(n, t.parentElement, !0)
            : null;
        }
      }
      let HR = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      const ml = new W("EventManagerPlugins");
      let _l = (() => {
        class e {
          constructor(t, i) {
            (this._zone = i),
              (this._eventNameToPlugin = new Map()),
              t.forEach((r) => (r.manager = this)),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, i, r) {
            return this._findPluginFor(i).addEventListener(t, i, r);
          }
          addGlobalEventListener(t, i, r) {
            return this._findPluginFor(i).addGlobalEventListener(t, i, r);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            const i = this._eventNameToPlugin.get(t);
            if (i) return i;
            const r = this._plugins;
            for (let o = 0; o < r.length; o++) {
              const s = r[o];
              if (s.supports(t)) return this._eventNameToPlugin.set(t, s), s;
            }
            throw new Error(`No event manager plugin found for event ${t}`);
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(ml), T(we));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      class p0 {
        constructor(n) {
          this._doc = n;
        }
        addGlobalEventListener(n, t, i) {
          const r = kn().getGlobalEventTarget(this._doc, n);
          if (!r)
            throw new Error(`Unsupported event target ${r} for event ${t}`);
          return this.addEventListener(r, t, i);
        }
      }
      let g0 = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(t) {
              const i = new Set();
              t.forEach((r) => {
                this._stylesSet.has(r) || (this._stylesSet.add(r), i.add(r));
              }),
                this.onStylesAdded(i);
            }
            onStylesAdded(t) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })(),
        hs = (() => {
          class e extends g0 {
            constructor(t) {
              super(),
                (this._doc = t),
                (this._hostNodes = new Map()),
                this._hostNodes.set(t.head, []);
            }
            _addStylesToHost(t, i, r) {
              t.forEach((o) => {
                const s = this._doc.createElement("style");
                (s.textContent = o), r.push(i.appendChild(s));
              });
            }
            addHost(t) {
              const i = [];
              this._addStylesToHost(this._stylesSet, t, i),
                this._hostNodes.set(t, i);
            }
            removeHost(t) {
              const i = this._hostNodes.get(t);
              i && i.forEach(m0), this._hostNodes.delete(t);
            }
            onStylesAdded(t) {
              this._hostNodes.forEach((i, r) => {
                this._addStylesToHost(t, r, i);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((t) => t.forEach(m0));
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(nt));
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })();
      function m0(e) {
        kn().remove(e);
      }
      const bf = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Df = /%COMP%/g;
      function vl(e, n, t) {
        for (let i = 0; i < n.length; i++) {
          let r = n[i];
          Array.isArray(r) ? vl(e, r, t) : ((r = r.replace(Df, e)), t.push(r));
        }
        return t;
      }
      function y0(e) {
        return (n) => {
          if ("__ngUnwrap__" === n) return e;
          !1 === e(n) && (n.preventDefault(), (n.returnValue = !1));
        };
      }
      let Cf = (() => {
        class e {
          constructor(t, i, r) {
            (this.eventManager = t),
              (this.sharedStylesHost = i),
              (this.appId = r),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new wf(t));
          }
          createRenderer(t, i) {
            if (!t || !i) return this.defaultRenderer;
            switch (i.encapsulation) {
              case Nn.Emulated: {
                let r = this.rendererByCompId.get(i.id);
                return (
                  r ||
                    ((r = new YR(
                      this.eventManager,
                      this.sharedStylesHost,
                      i,
                      this.appId
                    )),
                    this.rendererByCompId.set(i.id, r)),
                  r.applyToHost(t),
                  r
                );
              }
              case 1:
              case Nn.ShadowDom:
                return new qR(this.eventManager, this.sharedStylesHost, t, i);
              default:
                if (!this.rendererByCompId.has(i.id)) {
                  const r = vl(i.id, i.styles, []);
                  this.sharedStylesHost.addStyles(r),
                    this.rendererByCompId.set(i.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(_l), T(hs), T(ss));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      class wf {
        constructor(n) {
          (this.eventManager = n),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t
            ? document.createElementNS(bf[t] || t, n)
            : document.createElement(n);
        }
        createComment(n) {
          return document.createComment(n);
        }
        createText(n) {
          return document.createTextNode(n);
        }
        appendChild(n, t) {
          n.appendChild(t);
        }
        insertBefore(n, t, i) {
          n && n.insertBefore(t, i);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let i = "string" == typeof n ? document.querySelector(n) : n;
          if (!i)
            throw new Error(`The selector "${n}" did not match any elements`);
          return t || (i.textContent = ""), i;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, i, r) {
          if (r) {
            t = r + ":" + t;
            const o = bf[r];
            o ? n.setAttributeNS(o, t, i) : n.setAttribute(t, i);
          } else n.setAttribute(t, i);
        }
        removeAttribute(n, t, i) {
          if (i) {
            const r = bf[i];
            r ? n.removeAttributeNS(r, t) : n.removeAttribute(`${i}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, i, r) {
          r & (Vt.DashCase | Vt.Important)
            ? n.style.setProperty(t, i, r & Vt.Important ? "important" : "")
            : (n.style[t] = i);
        }
        removeStyle(n, t, i) {
          i & Vt.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
        }
        setProperty(n, t, i) {
          n[t] = i;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, i) {
          return "string" == typeof n
            ? this.eventManager.addGlobalEventListener(n, t, y0(i))
            : this.eventManager.addEventListener(n, t, y0(i));
        }
      }
      class YR extends wf {
        constructor(n, t, i, r) {
          super(n), (this.component = i);
          const o = vl(r + "-" + i.id, i.styles, []);
          t.addStyles(o),
            (this.contentAttr = (function GR(e) {
              return "_ngcontent-%COMP%".replace(Df, e);
            })(r + "-" + i.id)),
            (this.hostAttr = (function WR(e) {
              return "_nghost-%COMP%".replace(Df, e);
            })(r + "-" + i.id));
        }
        applyToHost(n) {
          super.setAttribute(n, this.hostAttr, "");
        }
        createElement(n, t) {
          const i = super.createElement(n, t);
          return super.setAttribute(i, this.contentAttr, ""), i;
        }
      }
      class qR extends wf {
        constructor(n, t, i, r) {
          super(n),
            (this.sharedStylesHost = t),
            (this.hostEl = i),
            (this.shadowRoot = i.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = vl(r.id, r.styles, []);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement("style");
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(n) {
          return n === this.hostEl ? this.shadowRoot : n;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(n, t) {
          return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, i) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, i);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(n))
          );
        }
      }
      let JR = (() => {
        class e extends p0 {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, i, r) {
            return (
              t.addEventListener(i, r, !1),
              () => this.removeEventListener(t, i, r)
            );
          }
          removeEventListener(t, i, r) {
            return t.removeEventListener(i, r);
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(nt));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      const D0 = ["alt", "control", "meta", "shift"],
        QR = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        C0 = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock",
        },
        KR = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let XR = (() => {
        class e extends p0 {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, i, r) {
            const o = e.parseEventName(i),
              s = e.eventCallback(o.fullKey, r, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => kn().onAndCancel(t, o.domEventName, s));
          }
          static parseEventName(t) {
            const i = t.toLowerCase().split("."),
              r = i.shift();
            if (0 === i.length || ("keydown" !== r && "keyup" !== r))
              return null;
            const o = e._normalizeKey(i.pop());
            let s = "";
            if (
              (D0.forEach((l) => {
                const u = i.indexOf(l);
                u > -1 && (i.splice(u, 1), (s += l + "."));
              }),
              (s += o),
              0 != i.length || 0 === o.length)
            )
              return null;
            const a = {};
            return (a.domEventName = r), (a.fullKey = s), a;
          }
          static getEventFullKey(t) {
            let i = "",
              r = (function ex(e) {
                let n = e.key;
                if (null == n) {
                  if (((n = e.keyIdentifier), null == n)) return "Unidentified";
                  n.startsWith("U+") &&
                    ((n = String.fromCharCode(parseInt(n.substring(2), 16))),
                    3 === e.location && C0.hasOwnProperty(n) && (n = C0[n]));
                }
                return QR[n] || n;
              })(t);
            return (
              (r = r.toLowerCase()),
              " " === r ? (r = "space") : "." === r && (r = "dot"),
              D0.forEach((o) => {
                o != r && KR[o](t) && (i += o + ".");
              }),
              (i += r),
              i
            );
          }
          static eventCallback(t, i, r) {
            return (o) => {
              e.getEventFullKey(o) === t && r.runGuarded(() => i(o));
            };
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(nt));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      const rx = Iy(oO, "browser", [
          { provide: el, useValue: "browser" },
          {
            provide: Dy,
            useValue: function tx() {
              vf.makeCurrent(), yf.init();
            },
            multi: !0,
          },
          {
            provide: nt,
            useFactory: function ix() {
              return (
                (function Mw(e) {
                  ku = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        ox = [
          { provide: Jc, useValue: "root" },
          {
            provide: Bo,
            useFactory: function nx() {
              return new Bo();
            },
            deps: [],
          },
          { provide: ml, useClass: JR, multi: !0, deps: [nt, we, el] },
          { provide: ml, useClass: XR, multi: !0, deps: [nt] },
          { provide: Cf, useClass: Cf, deps: [_l, hs, ss] },
          { provide: Cd, useExisting: Cf },
          { provide: g0, useExisting: hs },
          { provide: hs, useClass: hs, deps: [nt] },
          { provide: Yd, useClass: Yd, deps: [we] },
          { provide: _l, useClass: _l, deps: [ml, we] },
          { provide: class kR {}, useClass: HR, deps: [] },
        ];
      let sx = (() => {
        class e {
          constructor(t) {
            if (t)
              throw new Error(
                "BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead."
              );
          }
          static withServerTransition(t) {
            return {
              ngModule: e,
              providers: [
                { provide: ss, useValue: t.appId },
                { provide: h0, useExisting: ss },
                jR,
              ],
            };
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(e, 12));
          }),
          (e.??mod = ce({ type: e })),
          (e.??inj = se({ providers: ox, imports: [$t, sO] })),
          e
        );
      })();
      function B(...e) {
        return Ke(e, _o(e));
      }
      "undefined" != typeof window && window;
      class tt extends Ae {
        constructor(n) {
          super(), (this._value = n);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(n) {
          const t = super._subscribe(n);
          return !t.closed && n.next(this._value), t;
        }
        getValue() {
          const { hasError: n, thrownError: t, _value: i } = this;
          if (n) throw t;
          return this._throwIfClosed(), i;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      const { isArray: _x } = Array,
        { getPrototypeOf: vx, prototype: yx, keys: bx } = Object;
      const { isArray: Cx } = Array;
      function Nf(e) {
        return K((n) =>
          (function wx(e, n) {
            return Cx(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      function Mf(...e) {
        const n = _o(e),
          t = Zs(e),
          { args: i, keys: r } = (function N0(e) {
            if (1 === e.length) {
              const n = e[0];
              if (_x(n)) return { args: n, keys: null };
              if (
                (function Dx(e) {
                  return e && "object" == typeof e && vx(e) === yx;
                })(n)
              ) {
                const t = bx(n);
                return { args: t.map((i) => n[i]), keys: t };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === i.length) return Ke([], n);
        const o = new ge(
          (function Ex(e, n, t = $n) {
            return (i) => {
              T0(
                n,
                () => {
                  const { length: r } = e,
                    o = new Array(r);
                  let s = r,
                    a = r;
                  for (let l = 0; l < r; l++)
                    T0(
                      n,
                      () => {
                        const u = Ke(e[l], n);
                        let c = !1;
                        u.subscribe(
                          be(
                            i,
                            (d) => {
                              (o[l] = d),
                                c || ((c = !0), a--),
                                a || i.next(t(o.slice()));
                            },
                            () => {
                              --s || i.complete();
                            }
                          )
                        );
                      },
                      i
                    );
                },
                i
              );
            };
          })(
            i,
            n,
            r
              ? (s) =>
                  (function M0(e, n) {
                    return e.reduce((t, i, r) => ((t[i] = n[r]), t), {});
                  })(r, s)
              : $n
          )
        );
        return t ? o.pipe(Nf(t)) : o;
      }
      function T0(e, n, t) {
        e ? Un(t, e, n) : n();
      }
      function yl(e, n) {
        const t = ne(e) ? e : () => e,
          i = (r) => r.error(t());
        return new ge(n ? (r) => n.schedule(i, 0, r) : i);
      }
      const bl = go(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function ps(...e) {
        return (function Nx() {
          return mo(1);
        })()(Ke(e, _o(e)));
      }
      function S0(e) {
        return new ge((n) => {
          st(e()).subscribe(n);
        });
      }
      function A0() {
        return Pe((e, n) => {
          let t = null;
          e._refCount++;
          const i = be(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (t = null);
            const r = e._connection,
              o = t;
            (t = null),
              r && (!o || r === o) && r.unsubscribe(),
              n.unsubscribe();
          });
          e.subscribe(i), i.closed || (t = e.connect());
        });
      }
      class Mx extends ge {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Kh(n) && (this.lift = n.lift);
        }
        _subscribe(n) {
          return this.getSubject().subscribe(n);
        }
        getSubject() {
          const n = this._subject;
          return (
            (!n || n.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: n } = this;
          (this._subject = this._connection = null),
            null == n || n.unsubscribe();
        }
        connect() {
          let n = this._connection;
          if (!n) {
            n = this._connection = new Ot();
            const t = this.getSubject();
            n.add(
              this.source.subscribe(
                be(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (i) => {
                    this._teardown(), t.error(i);
                  },
                  () => this._teardown()
                )
              )
            ),
              n.closed && ((this._connection = null), (n = Ot.EMPTY));
          }
          return n;
        }
        refCount() {
          return A0()(this);
        }
      }
      function ri(e, n) {
        return Pe((t, i) => {
          let r = null,
            o = 0,
            s = !1;
          const a = () => s && !r && i.complete();
          t.subscribe(
            be(
              i,
              (l) => {
                null == r || r.unsubscribe();
                let u = 0;
                const c = o++;
                st(e(l, c)).subscribe(
                  (r = be(
                    i,
                    (d) => i.next(n ? n(l, d, c, u++) : d),
                    () => {
                      (r = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function Tx(e, n, t, i, r) {
        return (o, s) => {
          let a = t,
            l = n,
            u = 0;
          o.subscribe(
            be(
              s,
              (c) => {
                const d = u++;
                (l = a ? e(l, c, d) : ((a = !0), c)), i && s.next(l);
              },
              r &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function I0(e, n) {
        return Pe(Tx(e, n, arguments.length >= 2, !0));
      }
      function Ut(e, n) {
        return Pe((t, i) => {
          let r = 0;
          t.subscribe(be(i, (o) => e.call(n, o, r++) && i.next(o)));
        });
      }
      function wi(e) {
        return Pe((n, t) => {
          let o,
            i = null,
            r = !1;
          (i = n.subscribe(
            be(t, void 0, void 0, (s) => {
              (o = st(e(s, wi(e)(n)))),
                i ? (i.unsubscribe(), (i = null), o.subscribe(t)) : (r = !0);
            })
          )),
            r && (i.unsubscribe(), (i = null), o.subscribe(t));
        });
      }
      function gs(e, n) {
        return ne(n) ? je(e, n, 1) : je(e, 1);
      }
      function Tf(e) {
        return e <= 0
          ? () => rn
          : Pe((n, t) => {
              let i = [];
              n.subscribe(
                be(
                  t,
                  (r) => {
                    i.push(r), e < i.length && i.shift();
                  },
                  () => {
                    for (const r of i) t.next(r);
                    t.complete();
                  },
                  void 0,
                  () => {
                    i = null;
                  }
                )
              );
            });
      }
      function O0(e = Sx) {
        return Pe((n, t) => {
          let i = !1;
          n.subscribe(
            be(
              t,
              (r) => {
                (i = !0), t.next(r);
              },
              () => (i ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function Sx() {
        return new bl();
      }
      function R0(e) {
        return Pe((n, t) => {
          let i = !1;
          n.subscribe(
            be(
              t,
              (r) => {
                (i = !0), t.next(r);
              },
              () => {
                i || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function eo(e, n) {
        const t = arguments.length >= 2;
        return (i) =>
          i.pipe(
            e ? Ut((r, o) => e(r, o, i)) : $n,
            at(1),
            t ? R0(n) : O0(() => new bl())
          );
      }
      function Ct(e, n, t) {
        const i = ne(e) || n || t ? { next: e, error: n, complete: t } : e;
        return i
          ? Pe((r, o) => {
              var s;
              null === (s = i.subscribe) || void 0 === s || s.call(i);
              let a = !0;
              r.subscribe(
                be(
                  o,
                  (l) => {
                    var u;
                    null === (u = i.next) || void 0 === u || u.call(i, l),
                      o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = i.complete) || void 0 === l || l.call(i),
                      o.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = i.error) || void 0 === u || u.call(i, l),
                      o.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = i.unsubscribe) ||
                        void 0 === l ||
                        l.call(i)),
                      null === (u = i.finalize) || void 0 === u || u.call(i);
                  }
                )
              );
            })
          : $n;
      }
      class oi {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class Sf extends oi {
        constructor(n, t, i = "imperative", r = null) {
          super(n, t), (this.navigationTrigger = i), (this.restoredState = r);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ms extends oi {
        constructor(n, t, i) {
          super(n, t), (this.urlAfterRedirects = i);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class x0 extends oi {
        constructor(n, t, i) {
          super(n, t), (this.reason = i);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Ox extends oi {
        constructor(n, t, i) {
          super(n, t), (this.error = i);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class Rx extends oi {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class xx extends oi {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Px extends oi {
        constructor(n, t, i, r, o) {
          super(n, t),
            (this.urlAfterRedirects = i),
            (this.state = r),
            (this.shouldActivate = o);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class kx extends oi {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Fx extends oi {
        constructor(n, t, i, r) {
          super(n, t), (this.urlAfterRedirects = i), (this.state = r);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class P0 {
        constructor(n) {
          this.route = n;
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class k0 {
        constructor(n) {
          this.route = n;
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class Lx {
        constructor(n) {
          this.snapshot = n;
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Vx {
        constructor(n) {
          this.snapshot = n;
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Bx {
        constructor(n) {
          this.snapshot = n;
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class jx {
        constructor(n) {
          this.snapshot = n;
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class F0 {
        constructor(n, t, i) {
          (this.routerEvent = n), (this.position = t), (this.anchor = i);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      const q = "primary";
      class Hx {
        constructor(n) {
          this.params = n || {};
        }
        has(n) {
          return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function to(e) {
        return new Hx(e);
      }
      const L0 = "ngNavigationCancelingError";
      function Af(e) {
        const n = Error("NavigationCancelingError: " + e);
        return (n[L0] = !0), n;
      }
      function Ux(e, n, t) {
        const i = t.path.split("/");
        if (
          i.length > e.length ||
          ("full" === t.pathMatch && (n.hasChildren() || i.length < e.length))
        )
          return null;
        const r = {};
        for (let o = 0; o < i.length; o++) {
          const s = i[o],
            a = e[o];
          if (s.startsWith(":")) r[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, i.length), posParams: r };
      }
      function Fn(e, n) {
        const t = e ? Object.keys(e) : void 0,
          i = n ? Object.keys(n) : void 0;
        if (!t || !i || t.length != i.length) return !1;
        let r;
        for (let o = 0; o < t.length; o++)
          if (((r = t[o]), !V0(e[r], n[r]))) return !1;
        return !0;
      }
      function V0(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            i = [...n].sort();
          return t.every((r, o) => i[o] === r);
        }
        return e === n;
      }
      function B0(e) {
        return Array.prototype.concat.apply([], e);
      }
      function j0(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function it(e, n) {
        for (const t in e) e.hasOwnProperty(t) && n(e[t], t);
      }
      function Ln(e) {
        return cd(e) ? e : Yo(e) ? Ke(Promise.resolve(e)) : B(e);
      }
      const zx = {
          exact: function U0(e, n, t) {
            if (
              !qi(e.segments, n.segments) ||
              !Cl(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const i in n.children)
              if (!e.children[i] || !U0(e.children[i], n.children[i], t))
                return !1;
            return !0;
          },
          subset: G0,
        },
        H0 = {
          exact: function Yx(e, n) {
            return Fn(e, n);
          },
          subset: function qx(e, n) {
            return (
              Object.keys(n).length <= Object.keys(e).length &&
              Object.keys(n).every((t) => V0(e[t], n[t]))
            );
          },
          ignored: () => !0,
        };
      function $0(e, n, t) {
        return (
          zx[t.paths](e.root, n.root, t.matrixParams) &&
          H0[t.queryParams](e.queryParams, n.queryParams) &&
          !("exact" === t.fragment && e.fragment !== n.fragment)
        );
      }
      function G0(e, n, t) {
        return W0(e, n, n.segments, t);
      }
      function W0(e, n, t, i) {
        if (e.segments.length > t.length) {
          const r = e.segments.slice(0, t.length);
          return !(!qi(r, t) || n.hasChildren() || !Cl(r, t, i));
        }
        if (e.segments.length === t.length) {
          if (!qi(e.segments, t) || !Cl(e.segments, t, i)) return !1;
          for (const r in n.children)
            if (!e.children[r] || !G0(e.children[r], n.children[r], i))
              return !1;
          return !0;
        }
        {
          const r = t.slice(0, e.segments.length),
            o = t.slice(e.segments.length);
          return (
            !!(qi(e.segments, r) && Cl(e.segments, r, i) && e.children[q]) &&
            W0(e.children[q], n, o, i)
          );
        }
      }
      function Cl(e, n, t) {
        return n.every((i, r) => H0[t](e[r].parameters, i.parameters));
      }
      class Yi {
        constructor(n, t, i) {
          (this.root = n), (this.queryParams = t), (this.fragment = i);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = to(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return Qx.serialize(this);
        }
      }
      class Q {
        constructor(n, t) {
          (this.segments = n),
            (this.children = t),
            (this.parent = null),
            it(t, (i, r) => (i.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return wl(this);
        }
      }
      class _s {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = to(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return Z0(this);
        }
      }
      function qi(e, n) {
        return e.length === n.length && e.every((t, i) => t.path === n[i].path);
      }
      class z0 {}
      class Y0 {
        parse(n) {
          const t = new sP(n);
          return new Yi(
            t.parseRootSegment(),
            t.parseQueryParams(),
            t.parseFragment()
          );
        }
        serialize(n) {
          const t = `/${vs(n.root, !0)}`,
            i = (function eP(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const i = e[t];
                  return Array.isArray(i)
                    ? i.map((r) => `${El(t)}=${El(r)}`).join("&")
                    : `${El(t)}=${El(i)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join("&")}` : "";
            })(n.queryParams);
          return `${t}${i}${
            "string" == typeof n.fragment
              ? `#${(function Kx(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ""
          }`;
        }
      }
      const Qx = new Y0();
      function wl(e) {
        return e.segments.map((n) => Z0(n)).join("/");
      }
      function vs(e, n) {
        if (!e.hasChildren()) return wl(e);
        if (n) {
          const t = e.children[q] ? vs(e.children[q], !1) : "",
            i = [];
          return (
            it(e.children, (r, o) => {
              o !== q && i.push(`${o}:${vs(r, !1)}`);
            }),
            i.length > 0 ? `${t}(${i.join("//")})` : t
          );
        }
        {
          const t = (function Zx(e, n) {
            let t = [];
            return (
              it(e.children, (i, r) => {
                r === q && (t = t.concat(n(i, r)));
              }),
              it(e.children, (i, r) => {
                r !== q && (t = t.concat(n(i, r)));
              }),
              t
            );
          })(e, (i, r) =>
            r === q ? [vs(e.children[q], !1)] : [`${r}:${vs(i, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[q]
            ? `${wl(e)}/${t[0]}`
            : `${wl(e)}/(${t.join("//")})`;
        }
      }
      function q0(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function El(e) {
        return q0(e).replace(/%3B/gi, ";");
      }
      function If(e) {
        return q0(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Nl(e) {
        return decodeURIComponent(e);
      }
      function J0(e) {
        return Nl(e.replace(/\+/g, "%20"));
      }
      function Z0(e) {
        return `${If(e.path)}${(function Xx(e) {
          return Object.keys(e)
            .map((n) => `;${If(n)}=${If(e[n])}`)
            .join("");
        })(e.parameters)}`;
      }
      const tP = /^[^\/()?;=#]+/;
      function Ml(e) {
        const n = e.match(tP);
        return n ? n[0] : "";
      }
      const nP = /^[^=?&#]+/,
        rP = /^[^&#]+/;
      class sP {
        constructor(n) {
          (this.url = n), (this.remaining = n);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new Q([], {})
              : new Q([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const n = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(n);
            } while (this.consumeOptional("&"));
          return n;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const n = [];
          for (
            this.peekStartsWith("(") || n.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), n.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
          let i = {};
          return (
            this.peekStartsWith("(") && (i = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) && (i[q] = new Q(n, t)),
            i
          );
        }
        parseSegment() {
          const n = Ml(this.remaining);
          if ("" === n && this.peekStartsWith(";"))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`
            );
          return this.capture(n), new _s(Nl(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(";"); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = Ml(this.remaining);
          if (!t) return;
          this.capture(t);
          let i = "";
          if (this.consumeOptional("=")) {
            const r = Ml(this.remaining);
            r && ((i = r), this.capture(i));
          }
          n[Nl(t)] = Nl(i);
        }
        parseQueryParam(n) {
          const t = (function iP(e) {
            const n = e.match(nP);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let i = "";
          if (this.consumeOptional("=")) {
            const s = (function oP(e) {
              const n = e.match(rP);
              return n ? n[0] : "";
            })(this.remaining);
            s && ((i = s), this.capture(i));
          }
          const r = J0(t),
            o = J0(i);
          if (n.hasOwnProperty(r)) {
            let s = n[r];
            Array.isArray(s) || ((s = [s]), (n[r] = s)), s.push(o);
          } else n[r] = o;
        }
        parseParens(n) {
          const t = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const i = Ml(this.remaining),
              r = this.remaining[i.length];
            if ("/" !== r && ")" !== r && ";" !== r)
              throw new Error(`Cannot parse url '${this.url}'`);
            let o;
            i.indexOf(":") > -1
              ? ((o = i.substr(0, i.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : n && (o = q);
            const s = this.parseChildren();
            (t[o] = 1 === Object.keys(s).length ? s[q] : new Q([], s)),
              this.consumeOptional("//");
          }
          return t;
        }
        peekStartsWith(n) {
          return this.remaining.startsWith(n);
        }
        consumeOptional(n) {
          return (
            !!this.peekStartsWith(n) &&
            ((this.remaining = this.remaining.substring(n.length)), !0)
          );
        }
        capture(n) {
          if (!this.consumeOptional(n)) throw new Error(`Expected "${n}".`);
        }
      }
      class Q0 {
        constructor(n) {
          this._root = n;
        }
        get root() {
          return this._root.value;
        }
        parent(n) {
          const t = this.pathFromRoot(n);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
          const t = Of(n, this._root);
          return t ? t.children.map((i) => i.value) : [];
        }
        firstChild(n) {
          const t = Of(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = Rf(n, this._root);
          return t.length < 2
            ? []
            : t[t.length - 2].children
                .map((r) => r.value)
                .filter((r) => r !== n);
        }
        pathFromRoot(n) {
          return Rf(n, this._root).map((t) => t.value);
        }
      }
      function Of(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const i = Of(e, t);
          if (i) return i;
        }
        return null;
      }
      function Rf(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const i = Rf(e, t);
          if (i.length) return i.unshift(n), i;
        }
        return [];
      }
      class si {
        constructor(n, t) {
          (this.value = n), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function no(e) {
        const n = {};
        return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
      }
      class K0 extends Q0 {
        constructor(n, t) {
          super(n), (this.snapshot = t), xf(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function X0(e, n) {
        const t = (function aP(e, n) {
            const s = new Tl([], {}, {}, "", {}, q, n, null, e.root, -1, {});
            return new tb("", new si(s, []));
          })(e, n),
          i = new tt([new _s("", {})]),
          r = new tt({}),
          o = new tt({}),
          s = new tt({}),
          a = new tt(""),
          l = new io(i, r, s, a, o, q, n, t.root);
        return (l.snapshot = t.root), new K0(new si(l, []), t);
      }
      class io {
        constructor(n, t, i, r, o, s, a, l) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = i),
            (this.fragment = r),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(K((n) => to(n)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(K((n) => to(n)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function eb(e, n = "emptyOnly") {
        const t = e.pathFromRoot;
        let i = 0;
        if ("always" !== n)
          for (i = t.length - 1; i >= 1; ) {
            const r = t[i],
              o = t[i - 1];
            if (r.routeConfig && "" === r.routeConfig.path) i--;
            else {
              if (o.component) break;
              i--;
            }
          }
        return (function lP(e) {
          return e.reduce(
            (n, t) => ({
              params: Object.assign(Object.assign({}, n.params), t.params),
              data: Object.assign(Object.assign({}, n.data), t.data),
              resolve: Object.assign(
                Object.assign({}, n.resolve),
                t._resolvedData
              ),
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(i));
      }
      class Tl {
        constructor(n, t, i, r, o, s, a, l, u, c, d) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = i),
            (this.fragment = r),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = to(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = to(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((i) => i.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class tb extends Q0 {
        constructor(n, t) {
          super(t), (this.url = n), xf(this, t);
        }
        toString() {
          return nb(this._root);
        }
      }
      function xf(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => xf(e, t));
      }
      function nb(e) {
        const n =
          e.children.length > 0 ? ` { ${e.children.map(nb).join(", ")} } ` : "";
        return `${e.value}${n}`;
      }
      function Pf(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            Fn(n.queryParams, t.queryParams) ||
              e.queryParams.next(t.queryParams),
            n.fragment !== t.fragment && e.fragment.next(t.fragment),
            Fn(n.params, t.params) || e.params.next(t.params),
            (function Gx(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!Fn(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.url.next(t.url),
            Fn(n.data, t.data) || e.data.next(t.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function kf(e, n) {
        const t =
          Fn(e.params, n.params) &&
          (function Jx(e, n) {
            return (
              qi(e, n) && e.every((t, i) => Fn(t.parameters, n[i].parameters))
            );
          })(e.url, n.url);
        return (
          t &&
          !(!e.parent != !n.parent) &&
          (!e.parent || kf(e.parent, n.parent))
        );
      }
      function ys(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const i = t.value;
          i._futureSnapshot = n.value;
          const r = (function cP(e, n, t) {
            return n.children.map((i) => {
              for (const r of t.children)
                if (e.shouldReuseRoute(i.value, r.value.snapshot))
                  return ys(e, i, r);
              return ys(e, i);
            });
          })(e, n, t);
          return new si(i, r);
        }
        {
          if (e.shouldAttach(n.value)) {
            const o = e.retrieve(n.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = n.value),
                (s.children = n.children.map((a) => ys(e, a))),
                s
              );
            }
          }
          const i = (function dP(e) {
              return new io(
                new tt(e.url),
                new tt(e.params),
                new tt(e.queryParams),
                new tt(e.fragment),
                new tt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            r = n.children.map((o) => ys(e, o));
          return new si(i, r);
        }
      }
      function Sl(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function bs(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Ff(e, n, t, i, r) {
        let o = {};
        if (
          (i &&
            it(i, (a, l) => {
              o[l] = Array.isArray(a) ? a.map((u) => `${u}`) : `${a}`;
            }),
          e === n)
        )
          return new Yi(t, o, r);
        const s = ib(e, n, t);
        return new Yi(s, o, r);
      }
      function ib(e, n, t) {
        const i = {};
        return (
          it(e.children, (r, o) => {
            i[o] = r === n ? t : ib(r, n, t);
          }),
          new Q(e.segments, i)
        );
      }
      class rb {
        constructor(n, t, i) {
          if (
            ((this.isAbsolute = n),
            (this.numberOfDoubleDots = t),
            (this.commands = i),
            n && i.length > 0 && Sl(i[0]))
          )
            throw new Error("Root segment cannot have matrix parameters");
          const r = i.find(bs);
          if (r && r !== j0(i))
            throw new Error("{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Lf {
        constructor(n, t, i) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = i);
        }
      }
      function ob(e, n, t) {
        if (
          (e || (e = new Q([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Al(e, n, t);
        const i = (function _P(e, n, t) {
            let i = 0,
              r = n;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; r < e.segments.length; ) {
              if (i >= t.length) return o;
              const s = e.segments[r],
                a = t[i];
              if (bs(a)) break;
              const l = `${a}`,
                u = i < t.length - 1 ? t[i + 1] : null;
              if (r > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!ab(l, u, s)) return o;
                i += 2;
              } else {
                if (!ab(l, {}, s)) return o;
                i++;
              }
              r++;
            }
            return { match: !0, pathIndex: r, commandIndex: i };
          })(e, n, t),
          r = t.slice(i.commandIndex);
        if (i.match && i.pathIndex < e.segments.length) {
          const o = new Q(e.segments.slice(0, i.pathIndex), {});
          return (
            (o.children[q] = new Q(e.segments.slice(i.pathIndex), e.children)),
            Al(o, 0, r)
          );
        }
        return i.match && 0 === r.length
          ? new Q(e.segments, {})
          : i.match && !e.hasChildren()
          ? Vf(e, n, t)
          : i.match
          ? Al(e, 0, r)
          : Vf(e, n, t);
      }
      function Al(e, n, t) {
        if (0 === t.length) return new Q(e.segments, {});
        {
          const i = (function mP(e) {
              return bs(e[0]) ? e[0].outlets : { [q]: e };
            })(t),
            r = {};
          return (
            it(i, (o, s) => {
              "string" == typeof o && (o = [o]),
                null !== o && (r[s] = ob(e.children[s], n, o));
            }),
            it(e.children, (o, s) => {
              void 0 === i[s] && (r[s] = o);
            }),
            new Q(e.segments, r)
          );
        }
      }
      function Vf(e, n, t) {
        const i = e.segments.slice(0, n);
        let r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (bs(o)) {
            const l = vP(o.outlets);
            return new Q(i, l);
          }
          if (0 === r && Sl(t[0])) {
            i.push(new _s(e.segments[n].path, sb(t[0]))), r++;
            continue;
          }
          const s = bs(o) ? o.outlets[q] : `${o}`,
            a = r < t.length - 1 ? t[r + 1] : null;
          s && a && Sl(a)
            ? (i.push(new _s(s, sb(a))), (r += 2))
            : (i.push(new _s(s, {})), r++);
        }
        return new Q(i, {});
      }
      function vP(e) {
        const n = {};
        return (
          it(e, (t, i) => {
            "string" == typeof t && (t = [t]),
              null !== t && (n[i] = Vf(new Q([], {}), 0, t));
          }),
          n
        );
      }
      function sb(e) {
        const n = {};
        return it(e, (t, i) => (n[i] = `${t}`)), n;
      }
      function ab(e, n, t) {
        return e == t.path && Fn(n, t.parameters);
      }
      class bP {
        constructor(n, t, i, r) {
          (this.routeReuseStrategy = n),
            (this.futureState = t),
            (this.currState = i),
            (this.forwardEvent = r);
        }
        activate(n) {
          const t = this.futureState._root,
            i = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, i, n),
            Pf(this.futureState.root),
            this.activateChildRoutes(t, i, n);
        }
        deactivateChildRoutes(n, t, i) {
          const r = no(t);
          n.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, r[s], i), delete r[s];
          }),
            it(r, (o, s) => {
              this.deactivateRouteAndItsChildren(o, i);
            });
        }
        deactivateRoutes(n, t, i) {
          const r = n.value,
            o = t ? t.value : null;
          if (r === o)
            if (r.component) {
              const s = i.getContext(r.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, i);
          else o && this.deactivateRouteAndItsChildren(t, i);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component &&
          this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const i = t.getContext(n.value.outlet),
            r = i && n.value.component ? i.children : t,
            o = no(n);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], r);
          if (i && i.outlet) {
            const s = i.outlet.detach(),
              a = i.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, {
              componentRef: s,
              route: n,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const i = t.getContext(n.value.outlet),
            r = i && n.value.component ? i.children : t,
            o = no(n);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], r);
          i &&
            i.outlet &&
            (i.outlet.deactivate(),
            i.children.onOutletDeactivated(),
            (i.attachRef = null),
            (i.resolver = null),
            (i.route = null));
        }
        activateChildRoutes(n, t, i) {
          const r = no(t);
          n.children.forEach((o) => {
            this.activateRoutes(o, r[o.value.outlet], i),
              this.forwardEvent(new jx(o.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new Vx(n.value.snapshot));
        }
        activateRoutes(n, t, i) {
          const r = n.value,
            o = t ? t.value : null;
          if ((Pf(r), r === o))
            if (r.component) {
              const s = i.getOrCreateContext(r.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, i);
          else if (r.component) {
            const s = i.getOrCreateContext(r.outlet);
            if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(r.snapshot);
              this.routeReuseStrategy.store(r.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Pf(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = (function DP(e) {
                  for (let n = e.parent; n; n = n.parent) {
                    const t = n.routeConfig;
                    if (t && t._loadedConfig) return t._loadedConfig;
                    if (t && t.component) return null;
                  }
                  return null;
                })(r.snapshot),
                l = a ? a.module.componentFactoryResolver : null;
              (s.attachRef = null),
                (s.route = r),
                (s.resolver = l),
                s.outlet && s.outlet.activateWith(r, l),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, i);
        }
      }
      class Bf {
        constructor(n, t) {
          (this.routes = n), (this.module = t);
        }
      }
      function Ei(e) {
        return "function" == typeof e;
      }
      function Ji(e) {
        return e instanceof Yi;
      }
      const Ds = Symbol("INITIAL_VALUE");
      function Cs() {
        return ri((e) =>
          Mf(
            e.map((n) =>
              n.pipe(
                at(1),
                (function Dl(...e) {
                  const n = _o(e);
                  return Pe((t, i) => {
                    (n ? ps(e, t, n) : ps(e, t)).subscribe(i);
                  });
                })(Ds)
              )
            )
          ).pipe(
            I0((n, t) => {
              let i = !1;
              return t.reduce(
                (r, o, s) =>
                  r !== Ds
                    ? r
                    : (o === Ds && (i = !0),
                      i || (!1 !== o && s !== t.length - 1 && !Ji(o)) ? r : o),
                n
              );
            }, Ds),
            Ut((n) => n !== Ds),
            K((n) => (Ji(n) ? n : !0 === n)),
            at(1)
          )
        );
      }
      class TP {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new ws()),
            (this.attachRef = null);
        }
      }
      class ws {
        constructor() {
          this.contexts = new Map();
        }
        onChildOutletCreated(n, t) {
          const i = this.getOrCreateContext(n);
          (i.outlet = t), this.contexts.set(n, i);
        }
        onChildOutletDestroyed(n) {
          const t = this.getContext(n);
          t && ((t.outlet = null), (t.attachRef = null));
        }
        onOutletDeactivated() {
          const n = this.contexts;
          return (this.contexts = new Map()), n;
        }
        onOutletReAttached(n) {
          this.contexts = n;
        }
        getOrCreateContext(n) {
          let t = this.getContext(n);
          return t || ((t = new TP()), this.contexts.set(n, t)), t;
        }
        getContext(n) {
          return this.contexts.get(n) || null;
        }
      }
      let lb = (() => {
        class e {
          constructor(t, i, r, o, s) {
            (this.parentContexts = t),
              (this.location = i),
              (this.resolver = r),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new U()),
              (this.deactivateEvents = new U()),
              (this.attachEvents = new U()),
              (this.detachEvents = new U()),
              (this.name = o || q),
              t.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const t = this.parentContexts.getContext(this.name);
              t &&
                t.route &&
                (t.attachRef
                  ? this.attach(t.attachRef, t.route)
                  : this.activateWith(t.route, t.resolver || null));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const t = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(t.instance),
              t
            );
          }
          attach(t, i) {
            (this.activated = t),
              (this._activatedRoute = i),
              this.location.insert(t.hostView),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, i) {
            if (this.isActivated)
              throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = t;
            const s = (i = i || this.resolver).resolveComponentFactory(
                t._futureSnapshot.routeConfig.component
              ),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new SP(t, a, this.location.injector);
            (this.activated = this.location.createComponent(
              s,
              this.location.length,
              l
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(
              _(ws),
              _(gn),
              _(qr),
              (function Bi(e) {
                return (function iE(e, n) {
                  if ("class" === n) return e.classes;
                  if ("style" === n) return e.styles;
                  const t = e.attrs;
                  if (t) {
                    const i = t.length;
                    let r = 0;
                    for (; r < i; ) {
                      const o = t[r];
                      if (Up(o)) break;
                      if (0 === o) r += 2;
                      else if ("number" == typeof o)
                        for (r++; r < i && "string" == typeof t[r]; ) r++;
                      else {
                        if (o === n) return t[r + 1];
                        r += 2;
                      }
                    }
                  }
                  return null;
                })(ze(), e);
              })("name"),
              _(_n)
            );
          }),
          (e.??dir = C({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
          })),
          e
        );
      })();
      class SP {
        constructor(n, t, i) {
          (this.route = n), (this.childContexts = t), (this.parent = i);
        }
        get(n, t) {
          return n === io
            ? this.route
            : n === ws
            ? this.childContexts
            : this.parent.get(n, t);
        }
      }
      let ub = (() => {
        class e {}
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??cmp = gt({
            type: e,
            selectors: [["ng-component"]],
            decls: 1,
            vars: 0,
            template: function (t, i) {
              1 & t && At(0, "router-outlet");
            },
            directives: [lb],
            encapsulation: 2,
          })),
          e
        );
      })();
      function cb(e, n = "") {
        for (let t = 0; t < e.length; t++) {
          const i = e[t];
          AP(i, IP(n, i));
        }
      }
      function AP(e, n) {
        e.children && cb(e.children, n);
      }
      function IP(e, n) {
        return n
          ? e || n.path
            ? e && !n.path
              ? `${e}/`
              : !e && n.path
              ? n.path
              : `${e}/${n.path}`
            : ""
          : e;
      }
      function jf(e) {
        const n = e.children && e.children.map(jf),
          t = n
            ? Object.assign(Object.assign({}, e), { children: n })
            : Object.assign({}, e);
        return (
          !t.component &&
            (n || t.loadChildren) &&
            t.outlet &&
            t.outlet !== q &&
            (t.component = ub),
          t
        );
      }
      function Xt(e) {
        return e.outlet || q;
      }
      function db(e, n) {
        const t = e.filter((i) => Xt(i) === n);
        return t.push(...e.filter((i) => Xt(i) !== n)), t;
      }
      const fb = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Il(e, n, t) {
        var i;
        if ("" === n.path)
          return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? Object.assign({}, fb)
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: t,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (n.matcher || Ux)(t, e, n);
        if (!o) return Object.assign({}, fb);
        const s = {};
        it(o.posParams, (l, u) => {
          s[u] = l.path;
        });
        const a =
          o.consumed.length > 0
            ? Object.assign(
                Object.assign({}, s),
                o.consumed[o.consumed.length - 1].parameters
              )
            : s;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: t.slice(o.consumed.length),
          parameters: a,
          positionalParamSegments:
            null !== (i = o.posParams) && void 0 !== i ? i : {},
        };
      }
      function Ol(e, n, t, i, r = "corrected") {
        if (
          t.length > 0 &&
          (function xP(e, n, t) {
            return t.some((i) => Rl(e, n, i) && Xt(i) !== q);
          })(e, t, i)
        ) {
          const s = new Q(
            n,
            (function RP(e, n, t, i) {
              const r = {};
              (r[q] = i),
                (i._sourceSegment = e),
                (i._segmentIndexShift = n.length);
              for (const o of t)
                if ("" === o.path && Xt(o) !== q) {
                  const s = new Q([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = n.length),
                    (r[Xt(o)] = s);
                }
              return r;
            })(e, n, i, new Q(t, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = n.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === t.length &&
          (function PP(e, n, t) {
            return t.some((i) => Rl(e, n, i));
          })(e, t, i)
        ) {
          const s = new Q(
            e.segments,
            (function OP(e, n, t, i, r, o) {
              const s = {};
              for (const a of i)
                if (Rl(e, t, a) && !r[Xt(a)]) {
                  const l = new Q([], {});
                  (l._sourceSegment = e),
                    (l._segmentIndexShift =
                      "legacy" === o ? e.segments.length : n.length),
                    (s[Xt(a)] = l);
                }
              return Object.assign(Object.assign({}, r), s);
            })(e, n, t, i, e.children, r)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = n.length),
            { segmentGroup: s, slicedSegments: t }
          );
        }
        const o = new Q(e.segments, e.children);
        return (
          (o._sourceSegment = e),
          (o._segmentIndexShift = n.length),
          { segmentGroup: o, slicedSegments: t }
        );
      }
      function Rl(e, n, t) {
        return (
          (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) &&
          "" === t.path
        );
      }
      function hb(e, n, t, i) {
        return (
          !!(Xt(e) === i || (i !== q && Rl(n, t, e))) &&
          ("**" === e.path || Il(n, e, t).matched)
        );
      }
      function pb(e, n, t) {
        return 0 === n.length && !e.children[t];
      }
      class xl {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class gb {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function Es(e) {
        return yl(new xl(e));
      }
      function mb(e) {
        return yl(new gb(e));
      }
      class VP {
        constructor(n, t, i, r, o) {
          (this.configLoader = t),
            (this.urlSerializer = i),
            (this.urlTree = r),
            (this.config = o),
            (this.allowRedirects = !0),
            (this.ngModule = n.get(ei));
        }
        apply() {
          const n = Ol(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new Q(n.segments, n.children);
          return this.expandSegmentGroup(this.ngModule, this.config, t, q)
            .pipe(
              K((o) =>
                this.createUrlTree(
                  Hf(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              wi((o) => {
                if (o instanceof gb)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof xl ? this.noMatchError(o) : o;
              })
            );
        }
        match(n) {
          return this.expandSegmentGroup(this.ngModule, this.config, n.root, q)
            .pipe(
              K((r) => this.createUrlTree(Hf(r), n.queryParams, n.fragment))
            )
            .pipe(
              wi((r) => {
                throw r instanceof xl ? this.noMatchError(r) : r;
              })
            );
        }
        noMatchError(n) {
          return new Error(
            `Cannot match any routes. URL Segment: '${n.segmentGroup}'`
          );
        }
        createUrlTree(n, t, i) {
          const r = n.segments.length > 0 ? new Q([], { [q]: n }) : n;
          return new Yi(r, t, i);
        }
        expandSegmentGroup(n, t, i, r) {
          return 0 === i.segments.length && i.hasChildren()
            ? this.expandChildren(n, t, i).pipe(K((o) => new Q([], o)))
            : this.expandSegment(n, i, t, i.segments, r, !0);
        }
        expandChildren(n, t, i) {
          const r = [];
          for (const o of Object.keys(i.children))
            "primary" === o ? r.unshift(o) : r.push(o);
          return Ke(r).pipe(
            gs((o) => {
              const s = i.children[o],
                a = db(t, o);
              return this.expandSegmentGroup(n, a, s, o).pipe(
                K((l) => ({ segment: l, outlet: o }))
              );
            }),
            I0((o, s) => ((o[s.outlet] = s.segment), o), {}),
            (function Ax(e, n) {
              const t = arguments.length >= 2;
              return (i) =>
                i.pipe(
                  e ? Ut((r, o) => e(r, o, i)) : $n,
                  Tf(1),
                  t ? R0(n) : O0(() => new bl())
                );
            })()
          );
        }
        expandSegment(n, t, i, r, o, s) {
          return Ke(i).pipe(
            gs((a) =>
              this.expandSegmentAgainstRoute(n, t, i, a, r, o, s).pipe(
                wi((u) => {
                  if (u instanceof xl) return B(null);
                  throw u;
                })
              )
            ),
            eo((a) => !!a),
            wi((a, l) => {
              if (a instanceof bl || "EmptyError" === a.name)
                return pb(t, r, o) ? B(new Q([], {})) : Es(t);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(n, t, i, r, o, s, a) {
          return hb(r, t, o, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(n, t, r, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s)
              : Es(t)
            : Es(t);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s) {
          return "**" === r.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, i, r, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                n,
                t,
                i,
                r,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, i, r) {
          const o = this.applyRedirectCommands([], i.redirectTo, {});
          return i.redirectTo.startsWith("/")
            ? mb(o)
            : this.lineralizeSegments(i, o).pipe(
                je((s) => {
                  const a = new Q(s, {});
                  return this.expandSegment(n, a, t, s, r, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = Il(t, r, o);
          if (!a) return Es(t);
          const d = this.applyRedirectCommands(l, r.redirectTo, c);
          return r.redirectTo.startsWith("/")
            ? mb(d)
            : this.lineralizeSegments(r, d).pipe(
                je((f) => this.expandSegment(n, t, i, f.concat(u), s, !1))
              );
        }
        matchSegmentAgainstRoute(n, t, i, r, o) {
          if ("**" === i.path)
            return i.loadChildren
              ? (i._loadedConfig
                  ? B(i._loadedConfig)
                  : this.configLoader.load(n.injector, i)
                ).pipe(K((d) => ((i._loadedConfig = d), new Q(r, {}))))
              : B(new Q(r, {}));
          const {
            matched: s,
            consumedSegments: a,
            remainingSegments: l,
          } = Il(t, i, r);
          return s
            ? this.getChildConfig(n, i, r).pipe(
                je((c) => {
                  const d = c.module,
                    f = c.routes,
                    { segmentGroup: h, slicedSegments: p } = Ol(t, a, l, f),
                    g = new Q(h.segments, h.children);
                  if (0 === p.length && g.hasChildren())
                    return this.expandChildren(d, f, g).pipe(
                      K((D) => new Q(a, D))
                    );
                  if (0 === f.length && 0 === p.length) return B(new Q(a, {}));
                  const v = Xt(i) === o;
                  return this.expandSegment(d, g, f, p, v ? q : o, !0).pipe(
                    K((m) => new Q(a.concat(m.segments), m.children))
                  );
                })
              )
            : Es(t);
        }
        getChildConfig(n, t, i) {
          return t.children
            ? B(new Bf(t.children, n))
            : t.loadChildren
            ? void 0 !== t._loadedConfig
              ? B(t._loadedConfig)
              : this.runCanLoadGuards(n.injector, t, i).pipe(
                  je((r) =>
                    r
                      ? this.configLoader
                          .load(n.injector, t)
                          .pipe(K((o) => ((t._loadedConfig = o), o)))
                      : (function FP(e) {
                          return yl(
                            Af(
                              `Cannot load children because the guard of the route "path: '${e.path}'" returned false`
                            )
                          );
                        })(t)
                  )
                )
            : B(new Bf([], n));
        }
        runCanLoadGuards(n, t, i) {
          const r = t.canLoad;
          return r && 0 !== r.length
            ? B(
                r.map((s) => {
                  const a = n.get(s);
                  let l;
                  if (
                    (function wP(e) {
                      return e && Ei(e.canLoad);
                    })(a)
                  )
                    l = a.canLoad(t, i);
                  else {
                    if (!Ei(a)) throw new Error("Invalid CanLoad guard");
                    l = a(t, i);
                  }
                  return Ln(l);
                })
              ).pipe(
                Cs(),
                Ct((s) => {
                  if (!Ji(s)) return;
                  const a = Af(
                    `Redirecting to "${this.urlSerializer.serialize(s)}"`
                  );
                  throw ((a.url = s), a);
                }),
                K((s) => !0 === s)
              )
            : B(!0);
        }
        lineralizeSegments(n, t) {
          let i = [],
            r = t.root;
          for (;;) {
            if (((i = i.concat(r.segments)), 0 === r.numberOfChildren))
              return B(i);
            if (r.numberOfChildren > 1 || !r.children[q])
              return yl(
                new Error(
                  `Only absolute redirects can have named outlets. redirectTo: '${n.redirectTo}'`
                )
              );
            r = r.children[q];
          }
        }
        applyRedirectCommands(n, t, i) {
          return this.applyRedirectCreatreUrlTree(
            t,
            this.urlSerializer.parse(t),
            n,
            i
          );
        }
        applyRedirectCreatreUrlTree(n, t, i, r) {
          const o = this.createSegmentGroup(n, t.root, i, r);
          return new Yi(
            o,
            this.createQueryParams(t.queryParams, this.urlTree.queryParams),
            t.fragment
          );
        }
        createQueryParams(n, t) {
          const i = {};
          return (
            it(n, (r, o) => {
              if ("string" == typeof r && r.startsWith(":")) {
                const a = r.substring(1);
                i[o] = t[a];
              } else i[o] = r;
            }),
            i
          );
        }
        createSegmentGroup(n, t, i, r) {
          const o = this.createSegments(n, t.segments, i, r);
          let s = {};
          return (
            it(t.children, (a, l) => {
              s[l] = this.createSegmentGroup(n, a, i, r);
            }),
            new Q(o, s)
          );
        }
        createSegments(n, t, i, r) {
          return t.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(n, o, r)
              : this.findOrReturn(o, i)
          );
        }
        findPosParam(n, t, i) {
          const r = i[t.path.substring(1)];
          if (!r)
            throw new Error(
              `Cannot redirect to '${n}'. Cannot find '${t.path}'.`
            );
          return r;
        }
        findOrReturn(n, t) {
          let i = 0;
          for (const r of t) {
            if (r.path === n.path) return t.splice(i), r;
            i++;
          }
          return n;
        }
      }
      function Hf(e) {
        const n = {};
        for (const i of Object.keys(e.children)) {
          const o = Hf(e.children[i]);
          (o.segments.length > 0 || o.hasChildren()) && (n[i] = o);
        }
        return (function BP(e) {
          if (1 === e.numberOfChildren && e.children[q]) {
            const n = e.children[q];
            return new Q(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new Q(e.segments, n));
      }
      class _b {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Pl {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function HP(e, n, t) {
        const i = e._root;
        return Ns(i, n ? n._root : null, t, [i.value]);
      }
      function kl(e, n, t) {
        const i = (function UP(e) {
          if (!e) return null;
          for (let n = e.parent; n; n = n.parent) {
            const t = n.routeConfig;
            if (t && t._loadedConfig) return t._loadedConfig;
          }
          return null;
        })(n);
        return (i ? i.module.injector : t).get(e);
      }
      function Ns(
        e,
        n,
        t,
        i,
        r = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = no(n);
        return (
          e.children.forEach((s) => {
            (function GP(
              e,
              n,
              t,
              i,
              r = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function WP(e, n, t) {
                  if ("function" == typeof t) return t(e, n);
                  switch (t) {
                    case "pathParamsChange":
                      return !qi(e.url, n.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !qi(e.url, n.url) || !Fn(e.queryParams, n.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !kf(e, n) || !Fn(e.queryParams, n.queryParams);
                    default:
                      return !kf(e, n);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? r.canActivateChecks.push(new _b(i))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Ns(e, n, o.component ? (a ? a.children : null) : t, i, r),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    r.canDeactivateChecks.push(new Pl(a.outlet.component, s));
              } else
                s && Ms(n, a, r),
                  r.canActivateChecks.push(new _b(i)),
                  Ns(e, null, o.component ? (a ? a.children : null) : t, i, r);
            })(s, o[s.value.outlet], t, i.concat([s.value]), r),
              delete o[s.value.outlet];
          }),
          it(o, (s, a) => Ms(s, t.getContext(a), r)),
          r
        );
      }
      function Ms(e, n, t) {
        const i = no(e),
          r = e.value;
        it(i, (o, s) => {
          Ms(o, r.component ? (n ? n.children.getContext(s) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new Pl(
              r.component && n && n.outlet && n.outlet.isActivated
                ? n.outlet.component
                : null,
              r
            )
          );
      }
      class ek {}
      function vb(e) {
        return new ge((n) => n.error(e));
      }
      class nk {
        constructor(n, t, i, r, o, s) {
          (this.rootComponentType = n),
            (this.config = t),
            (this.urlTree = i),
            (this.url = r),
            (this.paramsInheritanceStrategy = o),
            (this.relativeLinkResolution = s);
        }
        recognize() {
          const n = Ol(
              this.urlTree.root,
              [],
              [],
              this.config.filter((s) => void 0 === s.redirectTo),
              this.relativeLinkResolution
            ).segmentGroup,
            t = this.processSegmentGroup(this.config, n, q);
          if (null === t) return null;
          const i = new Tl(
              [],
              Object.freeze({}),
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              q,
              this.rootComponentType,
              null,
              this.urlTree.root,
              -1,
              {}
            ),
            r = new si(i, t),
            o = new tb(this.url, r);
          return this.inheritParamsAndData(o._root), o;
        }
        inheritParamsAndData(n) {
          const t = n.value,
            i = eb(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(i.params)),
            (t.data = Object.freeze(i.data)),
            n.children.forEach((r) => this.inheritParamsAndData(r));
        }
        processSegmentGroup(n, t, i) {
          return 0 === t.segments.length && t.hasChildren()
            ? this.processChildren(n, t)
            : this.processSegment(n, t, t.segments, i);
        }
        processChildren(n, t) {
          const i = [];
          for (const o of Object.keys(t.children)) {
            const s = t.children[o],
              a = db(n, o),
              l = this.processSegmentGroup(a, s, o);
            if (null === l) return null;
            i.push(...l);
          }
          const r = yb(i);
          return (
            (function ik(e) {
              e.sort((n, t) =>
                n.value.outlet === q
                  ? -1
                  : t.value.outlet === q
                  ? 1
                  : n.value.outlet.localeCompare(t.value.outlet)
              );
            })(r),
            r
          );
        }
        processSegment(n, t, i, r) {
          for (const o of n) {
            const s = this.processSegmentAgainstRoute(o, t, i, r);
            if (null !== s) return s;
          }
          return pb(t, i, r) ? [] : null;
        }
        processSegmentAgainstRoute(n, t, i, r) {
          if (n.redirectTo || !hb(n, t, i, r)) return null;
          let o,
            s = [],
            a = [];
          if ("**" === n.path) {
            const h = i.length > 0 ? j0(i).parameters : {};
            o = new Tl(
              i,
              h,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              Cb(n),
              Xt(n),
              n.component,
              n,
              bb(t),
              Db(t) + i.length,
              wb(n)
            );
          } else {
            const h = Il(t, n, i);
            if (!h.matched) return null;
            (s = h.consumedSegments),
              (a = h.remainingSegments),
              (o = new Tl(
                s,
                h.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                Cb(n),
                Xt(n),
                n.component,
                n,
                bb(t),
                Db(t) + s.length,
                wb(n)
              ));
          }
          const l = (function rk(e) {
              return e.children
                ? e.children
                : e.loadChildren
                ? e._loadedConfig.routes
                : [];
            })(n),
            { segmentGroup: u, slicedSegments: c } = Ol(
              t,
              s,
              a,
              l.filter((h) => void 0 === h.redirectTo),
              this.relativeLinkResolution
            );
          if (0 === c.length && u.hasChildren()) {
            const h = this.processChildren(l, u);
            return null === h ? null : [new si(o, h)];
          }
          if (0 === l.length && 0 === c.length) return [new si(o, [])];
          const d = Xt(n) === r,
            f = this.processSegment(l, u, c, d ? q : r);
          return null === f ? null : [new si(o, f)];
        }
      }
      function ok(e) {
        const n = e.value.routeConfig;
        return n && "" === n.path && void 0 === n.redirectTo;
      }
      function yb(e) {
        const n = [],
          t = new Set();
        for (const i of e) {
          if (!ok(i)) {
            n.push(i);
            continue;
          }
          const r = n.find((o) => i.value.routeConfig === o.value.routeConfig);
          void 0 !== r ? (r.children.push(...i.children), t.add(r)) : n.push(i);
        }
        for (const i of t) {
          const r = yb(i.children);
          n.push(new si(i.value, r));
        }
        return n.filter((i) => !t.has(i));
      }
      function bb(e) {
        let n = e;
        for (; n._sourceSegment; ) n = n._sourceSegment;
        return n;
      }
      function Db(e) {
        let n = e,
          t = n._segmentIndexShift ? n._segmentIndexShift : 0;
        for (; n._sourceSegment; )
          (n = n._sourceSegment),
            (t += n._segmentIndexShift ? n._segmentIndexShift : 0);
        return t - 1;
      }
      function Cb(e) {
        return e.data || {};
      }
      function wb(e) {
        return e.resolve || {};
      }
      function Eb(e) {
        return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
      }
      function $f(e) {
        return ri((n) => {
          const t = e(n);
          return t ? Ke(t).pipe(K(() => n)) : B(n);
        });
      }
      class hk extends class fk {
        shouldDetach(n) {
          return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
          return !1;
        }
        retrieve(n) {
          return null;
        }
        shouldReuseRoute(n, t) {
          return n.routeConfig === t.routeConfig;
        }
      } {}
      const Uf = new W("ROUTES");
      class Nb {
        constructor(n, t, i, r) {
          (this.injector = n),
            (this.compiler = t),
            (this.onLoadStartListener = i),
            (this.onLoadEndListener = r);
        }
        load(n, t) {
          if (t._loader$) return t._loader$;
          this.onLoadStartListener && this.onLoadStartListener(t);
          const r = this.loadModuleFactory(t.loadChildren).pipe(
            K((o) => {
              this.onLoadEndListener && this.onLoadEndListener(t);
              const s = o.create(n);
              return new Bf(
                B0(s.injector.get(Uf, void 0, F.Self | F.Optional)).map(jf),
                s
              );
            }),
            wi((o) => {
              throw ((t._loader$ = void 0), o);
            })
          );
          return (
            (t._loader$ = new Mx(r, () => new Ae()).pipe(A0())), t._loader$
          );
        }
        loadModuleFactory(n) {
          return Ln(n()).pipe(
            je((t) =>
              t instanceof Bv ? B(t) : Ke(this.compiler.compileModuleAsync(t))
            )
          );
        }
      }
      class gk {
        shouldProcessUrl(n) {
          return !0;
        }
        extract(n) {
          return n;
        }
        merge(n, t) {
          return n;
        }
      }
      function mk(e) {
        throw e;
      }
      function _k(e, n, t) {
        return n.parse("/");
      }
      function Mb(e, n) {
        return B(null);
      }
      const vk = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        yk = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Gt = (() => {
        class e {
          constructor(t, i, r, o, s, a, l) {
            (this.rootComponentType = t),
              (this.urlSerializer = i),
              (this.rootContexts = r),
              (this.location = o),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Ae()),
              (this.errorHandler = mk),
              (this.malformedUriErrorHandler = _k),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: Mb,
                afterPreactivation: Mb,
              }),
              (this.urlHandlingStrategy = new gk()),
              (this.routeReuseStrategy = new hk()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.ngModule = s.get(ei)),
              (this.console = s.get(wy));
            const d = s.get(we);
            (this.isNgZoneEnabled = d instanceof we && we.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function Wx() {
                return new Yi(new Q([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new Nb(
                s,
                a,
                (f) => this.triggerEvent(new P0(f)),
                (f) => this.triggerEvent(new k0(f))
              )),
              (this.routerState = X0(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new tt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            var t;
            return null === (t = this.location.getState()) || void 0 === t
              ? void 0
              : t.??routerPageId;
          }
          setupNavigations(t) {
            const i = this.events;
            return t.pipe(
              Ut((r) => 0 !== r.id),
              K((r) =>
                Object.assign(Object.assign({}, r), {
                  extractedUrl: this.urlHandlingStrategy.extract(r.rawUrl),
                })
              ),
              ri((r) => {
                let o = !1,
                  s = !1;
                return B(r).pipe(
                  Ct((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.currentRawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null }
                          )
                        : null,
                    };
                  }),
                  ri((a) => {
                    const l = this.browserUrlTree.toString(),
                      u =
                        !this.navigated ||
                        a.extractedUrl.toString() !== l ||
                        l !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || u) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        Tb(a.source) && (this.browserUrlTree = a.extractedUrl),
                        B(a).pipe(
                          ri((d) => {
                            const f = this.transitions.getValue();
                            return (
                              i.next(
                                new Sf(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? rn
                                : Promise.resolve(d)
                            );
                          }),
                          (function jP(e, n, t, i) {
                            return ri((r) =>
                              (function LP(e, n, t, i, r) {
                                return new VP(e, n, t, i, r).apply();
                              })(e, n, t, r.extractedUrl, i).pipe(
                                K((o) =>
                                  Object.assign(Object.assign({}, r), {
                                    urlAfterRedirects: o,
                                  })
                                )
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          Ct((d) => {
                            this.currentNavigation = Object.assign(
                              Object.assign({}, this.currentNavigation),
                              { finalUrl: d.urlAfterRedirects }
                            );
                          }),
                          (function sk(e, n, t, i, r) {
                            return je((o) =>
                              (function tk(
                                e,
                                n,
                                t,
                                i,
                                r = "emptyOnly",
                                o = "legacy"
                              ) {
                                try {
                                  const s = new nk(
                                    e,
                                    n,
                                    t,
                                    i,
                                    r,
                                    o
                                  ).recognize();
                                  return null === s ? vb(new ek()) : B(s);
                                } catch (s) {
                                  return vb(s);
                                }
                              })(
                                e,
                                n,
                                o.urlAfterRedirects,
                                t(o.urlAfterRedirects),
                                i,
                                r
                              ).pipe(
                                K((s) =>
                                  Object.assign(Object.assign({}, o), {
                                    targetSnapshot: s,
                                  })
                                )
                              )
                            );
                          })(
                            this.rootComponentType,
                            this.config,
                            (d) => this.serializeUrl(d),
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          Ct((d) => {
                            if ("eager" === this.urlUpdateStrategy) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new Rx(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            i.next(f);
                          })
                        )
                      );
                    if (
                      u &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: g,
                          extras: v,
                        } = a,
                        y = new Sf(f, this.serializeUrl(h), p, g);
                      i.next(y);
                      const m = X0(h, this.rootComponentType).snapshot;
                      return B(
                        Object.assign(Object.assign({}, a), {
                          targetSnapshot: m,
                          urlAfterRedirects: h,
                          extras: Object.assign(Object.assign({}, v), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), rn;
                  }),
                  $f((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.beforePreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  Ct((a) => {
                    const l = new xx(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(l);
                  }),
                  K((a) =>
                    Object.assign(Object.assign({}, a), {
                      guards: HP(
                        a.targetSnapshot,
                        a.currentSnapshot,
                        this.rootContexts
                      ),
                    })
                  ),
                  (function zP(e, n) {
                    return je((t) => {
                      const {
                        targetSnapshot: i,
                        currentSnapshot: r,
                        guards: {
                          canActivateChecks: o,
                          canDeactivateChecks: s,
                        },
                      } = t;
                      return 0 === s.length && 0 === o.length
                        ? B(
                            Object.assign(Object.assign({}, t), {
                              guardsResult: !0,
                            })
                          )
                        : (function YP(e, n, t, i) {
                            return Ke(e).pipe(
                              je((r) =>
                                (function XP(e, n, t, i, r) {
                                  const o =
                                    n && n.routeConfig
                                      ? n.routeConfig.canDeactivate
                                      : null;
                                  return o && 0 !== o.length
                                    ? B(
                                        o.map((a) => {
                                          const l = kl(a, n, r);
                                          let u;
                                          if (
                                            (function MP(e) {
                                              return e && Ei(e.canDeactivate);
                                            })(l)
                                          )
                                            u = Ln(l.canDeactivate(e, n, t, i));
                                          else {
                                            if (!Ei(l))
                                              throw new Error(
                                                "Invalid CanDeactivate guard"
                                              );
                                            u = Ln(l(e, n, t, i));
                                          }
                                          return u.pipe(eo());
                                        })
                                      ).pipe(Cs())
                                    : B(!0);
                                })(r.component, r.route, t, n, i)
                              ),
                              eo((r) => !0 !== r, !0)
                            );
                          })(s, i, r, e).pipe(
                            je((a) =>
                              a &&
                              (function CP(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function qP(e, n, t, i) {
                                    return Ke(n).pipe(
                                      gs((r) =>
                                        ps(
                                          (function ZP(e, n) {
                                            return (
                                              null !== e && n && n(new Lx(e)),
                                              B(!0)
                                            );
                                          })(r.route.parent, i),
                                          (function JP(e, n) {
                                            return (
                                              null !== e && n && n(new Bx(e)),
                                              B(!0)
                                            );
                                          })(r.route, i),
                                          (function KP(e, n, t) {
                                            const i = n[n.length - 1],
                                              o = n
                                                .slice(0, n.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function $P(e) {
                                                    const n = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return n && 0 !== n.length
                                                      ? { node: e, guards: n }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  S0(() =>
                                                    B(
                                                      s.guards.map((l) => {
                                                        const u = kl(
                                                          l,
                                                          s.node,
                                                          t
                                                        );
                                                        let c;
                                                        if (
                                                          (function NP(e) {
                                                            return (
                                                              e &&
                                                              Ei(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(u)
                                                        )
                                                          c = Ln(
                                                            u.canActivateChild(
                                                              i,
                                                              e
                                                            )
                                                          );
                                                        else {
                                                          if (!Ei(u))
                                                            throw new Error(
                                                              "Invalid CanActivateChild guard"
                                                            );
                                                          c = Ln(u(i, e));
                                                        }
                                                        return c.pipe(eo());
                                                      })
                                                    ).pipe(Cs())
                                                  )
                                                );
                                            return B(o).pipe(Cs());
                                          })(e, r.path, t),
                                          (function QP(e, n, t) {
                                            const i = n.routeConfig
                                              ? n.routeConfig.canActivate
                                              : null;
                                            if (!i || 0 === i.length)
                                              return B(!0);
                                            const r = i.map((o) =>
                                              S0(() => {
                                                const s = kl(o, n, t);
                                                let a;
                                                if (
                                                  (function EP(e) {
                                                    return (
                                                      e && Ei(e.canActivate)
                                                    );
                                                  })(s)
                                                )
                                                  a = Ln(s.canActivate(n, e));
                                                else {
                                                  if (!Ei(s))
                                                    throw new Error(
                                                      "Invalid CanActivate guard"
                                                    );
                                                  a = Ln(s(n, e));
                                                }
                                                return a.pipe(eo());
                                              })
                                            );
                                            return B(r).pipe(Cs());
                                          })(e, r.route, t)
                                        )
                                      ),
                                      eo((r) => !0 !== r, !0)
                                    );
                                  })(i, o, e, n)
                                : B(a)
                            ),
                            K((a) =>
                              Object.assign(Object.assign({}, t), {
                                guardsResult: a,
                              })
                            )
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  Ct((a) => {
                    if (Ji(a.guardsResult)) {
                      const u = Af(
                        `Redirecting to "${this.serializeUrl(a.guardsResult)}"`
                      );
                      throw ((u.url = a.guardsResult), u);
                    }
                    const l = new Px(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(l);
                  }),
                  Ut(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, ""),
                      !1)
                  ),
                  $f((a) => {
                    if (a.guards.canActivateChecks.length)
                      return B(a).pipe(
                        Ct((l) => {
                          const u = new kx(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        }),
                        ri((l) => {
                          let u = !1;
                          return B(l).pipe(
                            (function ak(e, n) {
                              return je((t) => {
                                const {
                                  targetSnapshot: i,
                                  guards: { canActivateChecks: r },
                                } = t;
                                if (!r.length) return B(t);
                                let o = 0;
                                return Ke(r).pipe(
                                  gs((s) =>
                                    (function lk(e, n, t, i) {
                                      return (function uk(e, n, t, i) {
                                        const r = Eb(e);
                                        if (0 === r.length) return B({});
                                        const o = {};
                                        return Ke(r).pipe(
                                          je((s) =>
                                            (function ck(e, n, t, i) {
                                              const r = kl(e, n, i);
                                              return Ln(
                                                r.resolve
                                                  ? r.resolve(n, t)
                                                  : r(n, t)
                                              );
                                            })(e[s], n, t, i).pipe(
                                              Ct((a) => {
                                                o[s] = a;
                                              })
                                            )
                                          ),
                                          Tf(1),
                                          je(() =>
                                            Eb(o).length === r.length
                                              ? B(o)
                                              : rn
                                          )
                                        );
                                      })(e._resolve, e, n, i).pipe(
                                        K(
                                          (o) => (
                                            (e._resolvedData = o),
                                            (e.data = Object.assign(
                                              Object.assign({}, e.data),
                                              eb(e, t).resolve
                                            )),
                                            null
                                          )
                                        )
                                      );
                                    })(s.route, i, e, n)
                                  ),
                                  Ct(() => o++),
                                  Tf(1),
                                  je((s) => (o === r.length ? B(t) : rn))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            Ct({
                              next: () => (u = !0),
                              complete: () => {
                                u ||
                                  (this.restoreHistory(l),
                                  this.cancelNavigationTransition(
                                    l,
                                    "At least one route resolver didn't emit any value."
                                  ));
                              },
                            })
                          );
                        }),
                        Ct((l) => {
                          const u = new Fx(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        })
                      );
                  }),
                  $f((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.afterPreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  K((a) => {
                    const l = (function uP(e, n, t) {
                      const i = ys(e, n._root, t ? t._root : void 0);
                      return new K0(i, n);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return Object.assign(Object.assign({}, a), {
                      targetRouterState: l,
                    });
                  }),
                  Ct((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, n, t) =>
                    K(
                      (i) => (
                        new bP(
                          n,
                          i.targetRouterState,
                          i.currentRouterState,
                          t
                        ).activate(e),
                        i
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  Ct({
                    next() {
                      o = !0;
                    },
                    complete() {
                      o = !0;
                    },
                  }),
                  (function Ix(e) {
                    return Pe((n, t) => {
                      try {
                        n.subscribe(t);
                      } finally {
                        t.add(e);
                      }
                    });
                  })(() => {
                    var a;
                    o ||
                      s ||
                      this.cancelNavigationTransition(
                        r,
                        `Navigation ID ${r.id} is not equal to the current navigation id ${this.navigationId}`
                      ),
                      (null === (a = this.currentNavigation) || void 0 === a
                        ? void 0
                        : a.id) === r.id && (this.currentNavigation = null);
                  }),
                  wi((a) => {
                    if (
                      ((s = !0),
                      (function $x(e) {
                        return e && e[L0];
                      })(a))
                    ) {
                      const l = Ji(a.url);
                      l || ((this.navigated = !0), this.restoreHistory(r, !0));
                      const u = new x0(
                        r.id,
                        this.serializeUrl(r.extractedUrl),
                        a.message
                      );
                      i.next(u),
                        l
                          ? setTimeout(() => {
                              const c = this.urlHandlingStrategy.merge(
                                  a.url,
                                  this.rawUrlTree
                                ),
                                d = {
                                  skipLocationChange:
                                    r.extras.skipLocationChange,
                                  replaceUrl:
                                    "eager" === this.urlUpdateStrategy ||
                                    Tb(r.source),
                                };
                              this.scheduleNavigation(
                                c,
                                "imperative",
                                null,
                                d,
                                {
                                  resolve: r.resolve,
                                  reject: r.reject,
                                  promise: r.promise,
                                }
                              );
                            }, 0)
                          : r.resolve(!1);
                    } else {
                      this.restoreHistory(r, !0);
                      const l = new Ox(
                        r.id,
                        this.serializeUrl(r.extractedUrl),
                        a
                      );
                      i.next(l);
                      try {
                        r.resolve(this.errorHandler(a));
                      } catch (u) {
                        r.reject(u);
                      }
                    }
                    return rn;
                  })
                );
              })
            );
          }
          resetRootComponentType(t) {
            (this.rootComponentType = t),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(t) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.transitions.value), t)
            );
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((t) => {
                const i = "popstate" === t.type ? "popstate" : "hashchange";
                "popstate" === i &&
                  setTimeout(() => {
                    var r;
                    const o = { replaceUrl: !0 },
                      s = (
                        null === (r = t.state) || void 0 === r
                          ? void 0
                          : r.navigationId
                      )
                        ? t.state
                        : null;
                    if (s) {
                      const l = Object.assign({}, s);
                      delete l.navigationId,
                        delete l.??routerPageId,
                        0 !== Object.keys(l).length && (o.state = l);
                    }
                    const a = this.parseUrl(t.url);
                    this.scheduleNavigation(a, i, s, o);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(t) {
            this.events.next(t);
          }
          resetConfig(t) {
            cb(t),
              (this.config = t.map(jf)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(t, i = {}) {
            const {
                relativeTo: r,
                queryParams: o,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: l,
              } = i,
              u = r || this.routerState.root,
              c = l ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(
                  Object.assign({}, this.currentUrlTree.queryParams),
                  o
                );
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = o || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              (function fP(e, n, t, i, r) {
                if (0 === t.length) return Ff(n.root, n.root, n.root, i, r);
                const o = (function hP(e) {
                  if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
                    return new rb(!0, 0, e);
                  let n = 0,
                    t = !1;
                  const i = e.reduce((r, o, s) => {
                    if ("object" == typeof o && null != o) {
                      if (o.outlets) {
                        const a = {};
                        return (
                          it(o.outlets, (l, u) => {
                            a[u] = "string" == typeof l ? l.split("/") : l;
                          }),
                          [...r, { outlets: a }]
                        );
                      }
                      if (o.segmentPath) return [...r, o.segmentPath];
                    }
                    return "string" != typeof o
                      ? [...r, o]
                      : 0 === s
                      ? (o.split("/").forEach((a, l) => {
                          (0 == l && "." === a) ||
                            (0 == l && "" === a
                              ? (t = !0)
                              : ".." === a
                              ? n++
                              : "" != a && r.push(a));
                        }),
                        r)
                      : [...r, o];
                  }, []);
                  return new rb(t, n, i);
                })(t);
                if (o.toRoot()) return Ff(n.root, n.root, new Q([], {}), i, r);
                const s = (function pP(e, n, t) {
                    if (e.isAbsolute) return new Lf(n.root, !0, 0);
                    if (-1 === t.snapshot._lastPathIndex) {
                      const o = t.snapshot._urlSegment;
                      return new Lf(o, o === n.root, 0);
                    }
                    const i = Sl(e.commands[0]) ? 0 : 1;
                    return (function gP(e, n, t) {
                      let i = e,
                        r = n,
                        o = t;
                      for (; o > r; ) {
                        if (((o -= r), (i = i.parent), !i))
                          throw new Error("Invalid number of '../'");
                        r = i.segments.length;
                      }
                      return new Lf(i, !1, r - o);
                    })(
                      t.snapshot._urlSegment,
                      t.snapshot._lastPathIndex + i,
                      e.numberOfDoubleDots
                    );
                  })(o, n, e),
                  a = s.processChildren
                    ? Al(s.segmentGroup, s.index, o.commands)
                    : ob(s.segmentGroup, s.index, o.commands);
                return Ff(n.root, s.segmentGroup, a, i, r);
              })(u, this.currentUrlTree, t, d, null != c ? c : null)
            );
          }
          navigateByUrl(t, i = { skipLocationChange: !1 }) {
            const r = Ji(t) ? t : this.parseUrl(t),
              o = this.urlHandlingStrategy.merge(r, this.rawUrlTree);
            return this.scheduleNavigation(o, "imperative", null, i);
          }
          navigate(t, i = { skipLocationChange: !1 }) {
            return (
              (function bk(e) {
                for (let n = 0; n < e.length; n++) {
                  const t = e[n];
                  if (null == t)
                    throw new Error(
                      `The requested path contains ${t} segment at index ${n}`
                    );
                }
              })(t),
              this.navigateByUrl(this.createUrlTree(t, i), i)
            );
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t);
          }
          parseUrl(t) {
            let i;
            try {
              i = this.urlSerializer.parse(t);
            } catch (r) {
              i = this.malformedUriErrorHandler(r, this.urlSerializer, t);
            }
            return i;
          }
          isActive(t, i) {
            let r;
            if (
              ((r =
                !0 === i
                  ? Object.assign({}, vk)
                  : !1 === i
                  ? Object.assign({}, yk)
                  : i),
              Ji(t))
            )
              return $0(this.currentUrlTree, t, r);
            const o = this.parseUrl(t);
            return $0(this.currentUrlTree, o, r);
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((i, r) => {
              const o = t[r];
              return null != o && (i[r] = o), i;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (t) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = t.id),
                  (this.currentPageId = t.targetPageId),
                  this.events.next(
                    new ms(
                      t.id,
                      this.serializeUrl(t.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  t.resolve(!0);
              },
              (t) => {
                this.console.warn(`Unhandled Navigation Error: ${t}`);
              }
            );
          }
          scheduleNavigation(t, i, r, o, s) {
            var a, l;
            if (this.disposed) return Promise.resolve(!1);
            let u, c, d;
            s
              ? ((u = s.resolve), (c = s.reject), (d = s.promise))
              : (d = new Promise((p, g) => {
                  (u = p), (c = g);
                }));
            const f = ++this.navigationId;
            let h;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (r = this.location.getState()),
                  (h =
                    r && r.??routerPageId
                      ? r.??routerPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? null !== (a = this.browserPageId) && void 0 !== a
                        ? a
                        : 0
                      : (null !== (l = this.browserPageId) && void 0 !== l
                          ? l
                          : 0) + 1))
                : (h = 0),
              this.setTransition({
                id: f,
                targetPageId: h,
                source: i,
                restoredState: r,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: t,
                extras: o,
                resolve: u,
                reject: c,
                promise: d,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              d.catch((p) => Promise.reject(p))
            );
          }
          setBrowserUrl(t, i) {
            const r = this.urlSerializer.serialize(t),
              o = Object.assign(
                Object.assign({}, i.extras.state),
                this.generateNgRouterState(i.id, i.targetPageId)
              );
            this.location.isCurrentPathEqualTo(r) || i.extras.replaceUrl
              ? this.location.replaceState(r, "", o)
              : this.location.go(r, "", o);
          }
          restoreHistory(t, i = !1) {
            var r, o;
            if ("computed" === this.canceledNavigationResolution) {
              const s = this.currentPageId - t.targetPageId;
              ("popstate" !== t.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  (null === (r = this.currentNavigation) || void 0 === r
                    ? void 0
                    : r.finalUrl)) ||
              0 === s
                ? this.currentUrlTree ===
                    (null === (o = this.currentNavigation) || void 0 === o
                      ? void 0
                      : o.finalUrl) &&
                  0 === s &&
                  (this.resetState(t),
                  (this.browserUrlTree = t.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(s);
            } else
              "replace" === this.canceledNavigationResolution &&
                (i && this.resetState(t), this.resetUrlToCurrentUrlTree());
          }
          resetState(t) {
            (this.routerState = t.currentRouterState),
              (this.currentUrlTree = t.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                t.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(t, i) {
            const r = new x0(t.id, this.serializeUrl(t.extractedUrl), i);
            this.triggerEvent(r), t.resolve(!1);
          }
          generateNgRouterState(t, i) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: t, ??routerPageId: i }
              : { navigationId: t };
          }
        }
        return (
          (e.??fac = function (t) {
            sd();
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      function Tb(e) {
        return "imperative" !== e;
      }
      class Sb {}
      class Ab {
        preload(n, t) {
          return B(null);
        }
      }
      let Ib = (() => {
          class e {
            constructor(t, i, r, o) {
              (this.router = t),
                (this.injector = r),
                (this.preloadingStrategy = o),
                (this.loader = new Nb(
                  r,
                  i,
                  (l) => t.triggerEvent(new P0(l)),
                  (l) => t.triggerEvent(new k0(l))
                ));
            }
            setUpPreloading() {
              this.subscription = this.router.events
                .pipe(
                  Ut((t) => t instanceof ms),
                  gs(() => this.preload())
                )
                .subscribe(() => {});
            }
            preload() {
              const t = this.injector.get(ei);
              return this.processRoutes(t, this.router.config);
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(t, i) {
              const r = [];
              for (const o of i)
                if (o.loadChildren && !o.canLoad && o._loadedConfig) {
                  const s = o._loadedConfig;
                  r.push(this.processRoutes(s.module, s.routes));
                } else
                  o.loadChildren && !o.canLoad
                    ? r.push(this.preloadConfig(t, o))
                    : o.children && r.push(this.processRoutes(t, o.children));
              return Ke(r).pipe(
                mo(),
                K((o) => {})
              );
            }
            preloadConfig(t, i) {
              return this.preloadingStrategy.preload(i, () =>
                (i._loadedConfig
                  ? B(i._loadedConfig)
                  : this.loader.load(t.injector, i)
                ).pipe(
                  je(
                    (o) => (
                      (i._loadedConfig = o),
                      this.processRoutes(o.module, o.routes)
                    )
                  )
                )
              );
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(Gt), T(Ey), T(et), T(Sb));
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })(),
        zf = (() => {
          class e {
            constructor(t, i, r = {}) {
              (this.router = t),
                (this.viewportScroller = i),
                (this.options = r),
                (this.lastId = 0),
                (this.lastSource = "imperative"),
                (this.restoredId = 0),
                (this.store = {}),
                (r.scrollPositionRestoration =
                  r.scrollPositionRestoration || "disabled"),
                (r.anchorScrolling = r.anchorScrolling || "disabled");
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration("manual"),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents());
            }
            createScrollEvents() {
              return this.router.events.subscribe((t) => {
                t instanceof Sf
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = t.navigationTrigger),
                    (this.restoredId = t.restoredState
                      ? t.restoredState.navigationId
                      : 0))
                  : t instanceof ms &&
                    ((this.lastId = t.id),
                    this.scheduleScrollEvent(
                      t,
                      this.router.parseUrl(t.urlAfterRedirects).fragment
                    ));
              });
            }
            consumeScrollEvents() {
              return this.router.events.subscribe((t) => {
                t instanceof F0 &&
                  (t.position
                    ? "top" === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : "enabled" === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(t.position)
                    : t.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(t.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
              });
            }
            scheduleScrollEvent(t, i) {
              this.router.triggerEvent(
                new F0(
                  t,
                  "popstate" === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            }
            ngOnDestroy() {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe();
            }
          }
          return (
            (e.??fac = function (t) {
              sd();
            }),
            (e.??prov = x({ token: e, factory: e.??fac })),
            e
          );
        })();
      const Zi = new W("ROUTER_CONFIGURATION"),
        Ob = new W("ROUTER_FORROOT_GUARD"),
        Ek = [
          nf,
          { provide: z0, useClass: Y0 },
          {
            provide: Gt,
            useFactory: function Ak(e, n, t, i, r, o, s = {}, a, l) {
              const u = new Gt(null, e, n, t, i, r, B0(o));
              return (
                a && (u.urlHandlingStrategy = a),
                l && (u.routeReuseStrategy = l),
                (function Ik(e, n) {
                  e.errorHandler && (n.errorHandler = e.errorHandler),
                    e.malformedUriErrorHandler &&
                      (n.malformedUriErrorHandler = e.malformedUriErrorHandler),
                    e.onSameUrlNavigation &&
                      (n.onSameUrlNavigation = e.onSameUrlNavigation),
                    e.paramsInheritanceStrategy &&
                      (n.paramsInheritanceStrategy =
                        e.paramsInheritanceStrategy),
                    e.relativeLinkResolution &&
                      (n.relativeLinkResolution = e.relativeLinkResolution),
                    e.urlUpdateStrategy &&
                      (n.urlUpdateStrategy = e.urlUpdateStrategy),
                    e.canceledNavigationResolution &&
                      (n.canceledNavigationResolution =
                        e.canceledNavigationResolution);
                })(s, u),
                s.enableTracing &&
                  u.events.subscribe((c) => {
                    var d, f;
                    null === (d = console.group) ||
                      void 0 === d ||
                      d.call(console, `Router Event: ${c.constructor.name}`),
                      console.log(c.toString()),
                      console.log(c),
                      null === (f = console.groupEnd) ||
                        void 0 === f ||
                        f.call(console);
                  }),
                u
              );
            },
            deps: [
              z0,
              ws,
              nf,
              et,
              Ey,
              Uf,
              Zi,
              [class pk {}, new _i()],
              [class dk {}, new _i()],
            ],
          },
          ws,
          {
            provide: io,
            useFactory: function Ok(e) {
              return e.routerState.root;
            },
            deps: [Gt],
          },
          Ib,
          Ab,
          class wk {
            preload(n, t) {
              return t().pipe(wi(() => B(null)));
            }
          },
          { provide: Zi, useValue: { enableTracing: !1 } },
        ];
      function Nk() {
        return new Ay("Router", Gt);
      }
      let Rb = (() => {
        class e {
          constructor(t, i) {}
          static forRoot(t, i) {
            return {
              ngModule: e,
              providers: [
                Ek,
                xb(t),
                {
                  provide: Ob,
                  useFactory: Sk,
                  deps: [[Gt, new _i(), new xo()]],
                },
                { provide: Zi, useValue: i || {} },
                {
                  provide: Kr,
                  useFactory: Tk,
                  deps: [zi, [new Ca(tf), new _i()], Zi],
                },
                { provide: zf, useFactory: Mk, deps: [Gt, RR, Zi] },
                {
                  provide: Sb,
                  useExisting:
                    i && i.preloadingStrategy ? i.preloadingStrategy : Ab,
                },
                { provide: Ay, multi: !0, useFactory: Nk },
                [
                  Yf,
                  { provide: Hd, multi: !0, useFactory: Rk, deps: [Yf] },
                  { provide: Pb, useFactory: xk, deps: [Yf] },
                  { provide: Cy, multi: !0, useExisting: Pb },
                ],
              ],
            };
          }
          static forChild(t) {
            return { ngModule: e, providers: [xb(t)] };
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(Ob, 8), T(Gt, 8));
          }),
          (e.??mod = ce({ type: e })),
          (e.??inj = se({})),
          e
        );
      })();
      function Mk(e, n, t) {
        return t.scrollOffset && n.setOffset(t.scrollOffset), new zf(e, n, t);
      }
      function Tk(e, n, t = {}) {
        return t.useHash ? new pO(e, n) : new Jy(e, n);
      }
      function Sk(e) {
        return "guarded";
      }
      function xb(e) {
        return [
          { provide: lE, multi: !0, useValue: e },
          { provide: Uf, multi: !0, useValue: e },
        ];
      }
      let Yf = (() => {
        class e {
          constructor(t) {
            (this.injector = t),
              (this.initNavigation = !1),
              (this.destroyed = !1),
              (this.resultOfPreactivationDone = new Ae());
          }
          appInitializer() {
            return this.injector.get(dO, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let i = null;
              const r = new Promise((a) => (i = a)),
                o = this.injector.get(Gt),
                s = this.injector.get(Zi);
              return (
                "disabled" === s.initialNavigation
                  ? (o.setUpLocationChangeListener(), i(!0))
                  : "enabled" === s.initialNavigation ||
                    "enabledBlocking" === s.initialNavigation
                  ? ((o.hooks.afterPreactivation = () =>
                      this.initNavigation
                        ? B(null)
                        : ((this.initNavigation = !0),
                          i(!0),
                          this.resultOfPreactivationDone)),
                    o.initialNavigation())
                  : i(!0),
                r
              );
            });
          }
          bootstrapListener(t) {
            const i = this.injector.get(Zi),
              r = this.injector.get(Ib),
              o = this.injector.get(zf),
              s = this.injector.get(Gt),
              a = this.injector.get(tl);
            t === a.components[0] &&
              (("enabledNonBlocking" === i.initialNavigation ||
                void 0 === i.initialNavigation) &&
                s.initialNavigation(),
              r.setUpPreloading(),
              o.init(),
              s.resetRootComponentType(a.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete());
          }
          ngOnDestroy() {
            this.destroyed = !0;
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(T(et));
          }),
          (e.??prov = x({ token: e, factory: e.??fac })),
          e
        );
      })();
      function Rk(e) {
        return e.appInitializer.bind(e);
      }
      function xk(e) {
        return e.bootstrapListener.bind(e);
      }
      const Pb = new W("Router Initializer"),
        kk = [];
      let Fk = (() => {
        class e {}
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??mod = ce({ type: e })),
          (e.??inj = se({ imports: [[Rb.forRoot(kk)], Rb] })),
          e
        );
      })();
      const Lk = ["addListener", "removeListener"],
        Vk = ["addEventListener", "removeEventListener"],
        Bk = ["on", "off"];
      function wt(e, n, t, i) {
        if ((ne(t) && ((i = t), (t = void 0)), i))
          return wt(e, n, t).pipe(Nf(i));
        const [r, o] = (function $k(e) {
          return ne(e.addEventListener) && ne(e.removeEventListener);
        })(e)
          ? Vk.map((s) => (a) => e[s](n, a, t))
          : (function jk(e) {
              return ne(e.addListener) && ne(e.removeListener);
            })(e)
          ? Lk.map(kb(e, n))
          : (function Hk(e) {
              return ne(e.on) && ne(e.off);
            })(e)
          ? Bk.map(kb(e, n))
          : [];
        if (!r && _u(e)) return je((s) => wt(s, n, t))(st(e));
        if (!r) throw new TypeError("Invalid event target");
        return new ge((s) => {
          const a = (...l) => s.next(1 < l.length ? l : l[0]);
          return r(a), () => o(a);
        });
      }
      function kb(e, n) {
        return (t) => (i) => e[t](n, i);
      }
      class Uk extends Ot {
        constructor(n, t) {
          super();
        }
        schedule(n, t = 0) {
          return this;
        }
      }
      const Fl = {
          setInterval(e, n, ...t) {
            const { delegate: i } = Fl;
            return (null == i ? void 0 : i.setInterval)
              ? i.setInterval(e, n, ...t)
              : setInterval(e, n, ...t);
          },
          clearInterval(e) {
            const { delegate: n } = Fl;
            return ((null == n ? void 0 : n.clearInterval) || clearInterval)(e);
          },
          delegate: void 0,
        },
        Fb = { now: () => (Fb.delegate || Date).now(), delegate: void 0 };
      class Ts {
        constructor(n, t = Ts.now) {
          (this.schedulerActionCtor = n), (this.now = t);
        }
        schedule(n, t = 0, i) {
          return new this.schedulerActionCtor(this, n).schedule(i, t);
        }
      }
      Ts.now = Fb.now;
      const zk = new (class Wk extends Ts {
        constructor(n, t = Ts.now) {
          super(n, t),
            (this.actions = []),
            (this._active = !1),
            (this._scheduled = void 0);
        }
        flush(n) {
          const { actions: t } = this;
          if (this._active) return void t.push(n);
          let i;
          this._active = !0;
          do {
            if ((i = n.execute(n.state, n.delay))) break;
          } while ((n = t.shift()));
          if (((this._active = !1), i)) {
            for (; (n = t.shift()); ) n.unsubscribe();
            throw i;
          }
        }
      })(
        class Gk extends Uk {
          constructor(n, t) {
            super(n, t),
              (this.scheduler = n),
              (this.work = t),
              (this.pending = !1);
          }
          schedule(n, t = 0) {
            if (this.closed) return this;
            this.state = n;
            const i = this.id,
              r = this.scheduler;
            return (
              null != i && (this.id = this.recycleAsyncId(r, i, t)),
              (this.pending = !0),
              (this.delay = t),
              (this.id = this.id || this.requestAsyncId(r, this.id, t)),
              this
            );
          }
          requestAsyncId(n, t, i = 0) {
            return Fl.setInterval(n.flush.bind(n, this), i);
          }
          recycleAsyncId(n, t, i = 0) {
            if (null != i && this.delay === i && !1 === this.pending) return t;
            Fl.clearInterval(t);
          }
          execute(n, t) {
            if (this.closed) return new Error("executing a cancelled action");
            this.pending = !1;
            const i = this._execute(n, t);
            if (i) return i;
            !1 === this.pending &&
              null != this.id &&
              (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
          }
          _execute(n, t) {
            let r,
              i = !1;
            try {
              this.work(n);
            } catch (o) {
              (i = !0),
                (r = o || new Error("Scheduled action threw falsy error"));
            }
            if (i) return this.unsubscribe(), r;
          }
          unsubscribe() {
            if (!this.closed) {
              const { id: n, scheduler: t } = this,
                { actions: i } = t;
              (this.work = this.state = this.scheduler = null),
                (this.pending = !1),
                lr(i, this),
                null != n && (this.id = this.recycleAsyncId(t, n, null)),
                (this.delay = null),
                super.unsubscribe();
            }
          }
        }
      );
      const { isArray: qk } = Array;
      function Vb(e) {
        return 1 === e.length && qk(e[0]) ? e[0] : e;
      }
      function Ll(...e) {
        const n = Zs(e),
          t = Vb(e);
        return t.length
          ? new ge((i) => {
              let r = t.map(() => []),
                o = t.map(() => !1);
              i.add(() => {
                r = o = null;
              });
              for (let s = 0; !i.closed && s < t.length; s++)
                st(t[s]).subscribe(
                  be(
                    i,
                    (a) => {
                      if ((r[s].push(a), r.every((l) => l.length))) {
                        const l = r.map((u) => u.shift());
                        i.next(n ? n(...l) : l),
                          r.some((u, c) => !u.length && o[c]) && i.complete();
                      }
                    },
                    () => {
                      (o[s] = !0), !r[s].length && i.complete();
                    }
                  )
                );
              return () => {
                r = o = null;
              };
            })
          : rn;
      }
      function Ze(e) {
        return Pe((n, t) => {
          st(e).subscribe(be(t, () => t.complete(), ur)),
            !t.closed && n.subscribe(t);
        });
      }
      function Zf(...e) {
        const n = Zs(e);
        return Pe((t, i) => {
          const r = e.length,
            o = new Array(r);
          let s = e.map(() => !1),
            a = !1;
          for (let l = 0; l < r; l++)
            st(e[l]).subscribe(
              be(
                i,
                (u) => {
                  (o[l] = u),
                    !a &&
                      !s[l] &&
                      ((s[l] = !0), (a = s.every($n)) && (s = null));
                },
                ur
              )
            );
          t.subscribe(
            be(i, (l) => {
              if (a) {
                const u = [l, ...o];
                i.next(n ? n(...u) : u);
              }
            })
          );
        });
      }
      new ge(ur);
      let I1 = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })(),
        tL = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[I1]] })),
            e
          );
        })(),
        nL = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [tL] })),
            e
          );
        })();
      Math, Math, Math;
      const lD = ["*"],
        SV = ["dialog"];
      function u2(e, n) {
        if (
          (1 & e &&
            (A(0, "span"),
            Xn(1, 2),
            (function qv(e, n) {
              const t = ee();
              let i;
              const r = e + 20;
              t.firstCreatePass
                ? ((i = (function UA(e, n) {
                    if (n)
                      for (let t = n.length - 1; t >= 0; t--) {
                        const i = n[t];
                        if (e === i.name) return i;
                      }
                  })(n, t.pipeRegistry)),
                  (t.data[r] = i),
                  i.onDestroy &&
                    (t.destroyHooks || (t.destroyHooks = [])).push(
                      r,
                      i.onDestroy
                    ))
                : (i = t.data[r]);
              const o = i.factory || (i.factory = Vi(i.type)),
                s = di(_);
              try {
                const a = ga(!1),
                  l = o();
                return (
                  ga(a),
                  (function _T(e, n, t, i) {
                    t >= e.data.length &&
                      ((e.data[t] = null), (e.blueprint[t] = null)),
                      (n[t] = i);
                  })(t, b(), r, l),
                  l
                );
              } finally {
                di(s);
              }
            })(2, "percent"),
            O()),
          2 & e)
        ) {
          const t = de();
          S(2),
            Ya(Jv(2, 1, t.getValue() / t.max)),
            (function _d(e) {
              !(function LS(e, n, t) {
                if (Ko > 0) {
                  const i = e.data[t];
                  bv(e, n, Array.isArray(i) ? i : i.update, Yn() - Ko - 1, Qo);
                }
                (Qo = 0), (Ko = 0);
              })(ee(), b(), e + 20);
            })(1);
        }
      }
      function jn(e) {
        return !isNaN(
          (function Ql(e) {
            return parseInt(`${e}`, 10);
          })(e)
        );
      }
      function er(e) {
        return null != e;
      }
      function fo(e) {
        return (e || document.body).getBoundingClientRect();
      }
      "undefined" != typeof Element &&
        !Element.prototype.closest &&
        (Element.prototype.closest = function (e) {
          let n = this;
          if (!document.documentElement.contains(n)) return null;
          do {
            if (n.matches(e)) return n;
            n = n.parentElement || n.parentNode;
          } while (null !== n && 1 === n.nodeType);
          return null;
        });
      const dD = { animation: !0, transitionTimerDelayMs: 5 },
        E2 = () => {},
        { transitionTimerDelayMs: N2 } = dD,
        Vs = new Map(),
        Nt = (e, n, t, i) => {
          let r = i.context || {};
          const o = Vs.get(n);
          if (o)
            switch (i.runningTransition) {
              case "continue":
                return rn;
              case "stop":
                e.run(() => o.transition$.complete()),
                  (r = Object.assign(o.context, r)),
                  Vs.delete(n);
            }
          const s = t(n, i.animation, r) || E2;
          if (
            !i.animation ||
            "none" === window.getComputedStyle(n).transitionProperty
          )
            return (
              e.run(() => s()),
              B(void 0).pipe(
                (function C2(e) {
                  return (n) =>
                    new ge((t) =>
                      n.subscribe({
                        next: (s) => e.run(() => t.next(s)),
                        error: (s) => e.run(() => t.error(s)),
                        complete: () => e.run(() => t.complete()),
                      })
                    );
                })(e)
              )
            );
          const a = new Ae(),
            l = new Ae(),
            u = a.pipe(
              (function Zk(...e) {
                return (n) => ps(n, B(...e));
              })(!0)
            );
          Vs.set(n, {
            transition$: a,
            complete: () => {
              l.next(), l.complete();
            },
            context: r,
          });
          const c = (function w2(e) {
            const { transitionDelay: n, transitionDuration: t } =
              window.getComputedStyle(e);
            return 1e3 * (parseFloat(n) + parseFloat(t));
          })(n);
          return (
            e.runOutsideAngular(() => {
              const d = wt(n, "transitionend").pipe(
                Ze(u),
                Ut(({ target: h }) => h === n)
              );
              (function Bb(...e) {
                return 1 === (e = Vb(e)).length
                  ? st(e[0])
                  : new ge(
                      (function Jk(e) {
                        return (n) => {
                          let t = [];
                          for (let i = 0; t && !n.closed && i < e.length; i++)
                            t.push(
                              st(e[i]).subscribe(
                                be(n, (r) => {
                                  if (t) {
                                    for (let o = 0; o < t.length; o++)
                                      o !== i && t[o].unsubscribe();
                                    t = null;
                                  }
                                  n.next(r);
                                })
                              )
                            );
                        };
                      })(e)
                    );
              })(
                (function qf(e = 0, n, t = zk) {
                  let i = -1;
                  return (
                    null != n && (dp(n) ? (t = n) : (i = n)),
                    new ge((r) => {
                      let o = (function Yk(e) {
                        return e instanceof Date && !isNaN(e);
                      })(e)
                        ? +e - t.now()
                        : e;
                      o < 0 && (o = 0);
                      let s = 0;
                      return t.schedule(function () {
                        r.closed ||
                          (r.next(s++),
                          0 <= i ? this.schedule(void 0, i) : r.complete());
                      }, o);
                    })
                  );
                })(c + N2).pipe(Ze(u)),
                d,
                l
              )
                .pipe(Ze(u))
                .subscribe(() => {
                  Vs.delete(n),
                    e.run(() => {
                      s(), a.next(), a.complete();
                    });
                });
            }),
            a.asObservable()
          );
        };
      let Kl = (() => {
          class e {
            constructor() {
              this.animation = dD.animation;
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        _D = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        vD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        bD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })(),
        wD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        ED = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })();
      var Qe = (() => {
        return (
          ((e = Qe || (Qe = {}))[(e.Tab = 9)] = "Tab"),
          (e[(e.Enter = 13)] = "Enter"),
          (e[(e.Escape = 27)] = "Escape"),
          (e[(e.Space = 32)] = "Space"),
          (e[(e.PageUp = 33)] = "PageUp"),
          (e[(e.PageDown = 34)] = "PageDown"),
          (e[(e.End = 35)] = "End"),
          (e[(e.Home = 36)] = "Home"),
          (e[(e.ArrowLeft = 37)] = "ArrowLeft"),
          (e[(e.ArrowUp = 38)] = "ArrowUp"),
          (e[(e.ArrowRight = 39)] = "ArrowRight"),
          (e[(e.ArrowDown = 40)] = "ArrowDown"),
          Qe
        );
        var e;
      })();
      "undefined" != typeof navigator &&
        navigator.userAgent &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (/Macintosh/.test(navigator.userAgent) &&
            navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 2) ||
          /Android/.test(navigator.userAgent));
      const MD = [
        "a[href]",
        "button:not([disabled])",
        'input:not([disabled]):not([type="hidden"])',
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[contenteditable]",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");
      function TD(e) {
        const n = Array.from(e.querySelectorAll(MD)).filter(
          (t) => -1 !== t.tabIndex
        );
        return [n[0], n[n.length - 1]];
      }
      new Date(1882, 10, 12), new Date(2174, 10, 25);
      let kD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t, nL]] })),
            e
          );
        })(),
        Lh = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??dir = C({ type: e, selectors: [["", 8, "navbar"]] })),
            e
          );
        })(),
        VD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })();
      class rr {
        constructor(n, t, i) {
          (this.nodes = n), (this.viewRef = t), (this.componentRef = i);
        }
      }
      let mB = (() => {
        class e {
          constructor(t, i) {
            (this._el = t), (this._zone = i);
          }
          ngOnInit() {
            this._zone.onStable
              .asObservable()
              .pipe(at(1))
              .subscribe(() => {
                Nt(
                  this._zone,
                  this._el.nativeElement,
                  (t, i) => {
                    i && fo(t), t.classList.add("show");
                  },
                  { animation: this.animation, runningTransition: "continue" }
                );
              });
          }
          hide() {
            return Nt(
              this._zone,
              this._el.nativeElement,
              ({ classList: t }) => t.remove("show"),
              { animation: this.animation, runningTransition: "stop" }
            );
          }
        }
        return (
          (e.??fac = function (t) {
            return new (t || e)(_(_e), _(we));
          }),
          (e.??cmp = gt({
            type: e,
            selectors: [["ngb-modal-backdrop"]],
            hostAttrs: [2, "z-index", "1055"],
            hostVars: 6,
            hostBindings: function (t, i) {
              2 & t &&
                ($i(
                  "modal-backdrop" +
                    (i.backdropClass ? " " + i.backdropClass : "")
                ),
                Ne("show", !i.animation)("fade", i.animation));
            },
            inputs: { animation: "animation", backdropClass: "backdropClass" },
            decls: 0,
            vars: 0,
            template: function (t, i) {},
            encapsulation: 2,
          })),
          e
        );
      })();
      class BD {
        close(n) {}
        dismiss(n) {}
      }
      class _B {
        constructor(n, t, i, r) {
          (this._windowCmptRef = n),
            (this._contentRef = t),
            (this._backdropCmptRef = i),
            (this._beforeDismiss = r),
            (this._closed = new Ae()),
            (this._dismissed = new Ae()),
            (this._hidden = new Ae()),
            n.instance.dismissEvent.subscribe((o) => {
              this.dismiss(o);
            }),
            (this.result = new Promise((o, s) => {
              (this._resolve = o), (this._reject = s);
            })),
            this.result.then(null, () => {});
        }
        get componentInstance() {
          if (this._contentRef && this._contentRef.componentRef)
            return this._contentRef.componentRef.instance;
        }
        get closed() {
          return this._closed.asObservable().pipe(Ze(this._hidden));
        }
        get dismissed() {
          return this._dismissed.asObservable().pipe(Ze(this._hidden));
        }
        get hidden() {
          return this._hidden.asObservable();
        }
        get shown() {
          return this._windowCmptRef.instance.shown.asObservable();
        }
        close(n) {
          this._windowCmptRef &&
            (this._closed.next(n),
            this._resolve(n),
            this._removeModalElements());
        }
        _dismiss(n) {
          this._dismissed.next(n), this._reject(n), this._removeModalElements();
        }
        dismiss(n) {
          if (this._windowCmptRef)
            if (this._beforeDismiss) {
              const t = this._beforeDismiss();
              !(function b2(e) {
                return e && e.then;
              })(t)
                ? !1 !== t && this._dismiss(n)
                : t.then(
                    (i) => {
                      !1 !== i && this._dismiss(n);
                    },
                    () => {}
                  );
            } else this._dismiss(n);
        }
        _removeModalElements() {
          const n = this._windowCmptRef.instance.hide(),
            t = this._backdropCmptRef
              ? this._backdropCmptRef.instance.hide()
              : B(void 0);
          n.subscribe(() => {
            const { nativeElement: i } = this._windowCmptRef.location;
            i.parentNode.removeChild(i),
              this._windowCmptRef.destroy(),
              this._contentRef &&
                this._contentRef.viewRef &&
                this._contentRef.viewRef.destroy(),
              (this._windowCmptRef = null),
              (this._contentRef = null);
          }),
            t.subscribe(() => {
              if (this._backdropCmptRef) {
                const { nativeElement: i } = this._backdropCmptRef.location;
                i.parentNode.removeChild(i),
                  this._backdropCmptRef.destroy(),
                  (this._backdropCmptRef = null);
              }
            }),
            Ll(n, t).subscribe(() => {
              this._hidden.next(), this._hidden.complete();
            });
        }
      }
      var $s = (() => {
        return (
          ((e = $s || ($s = {}))[(e.BACKDROP_CLICK = 0)] = "BACKDROP_CLICK"),
          (e[(e.ESC = 1)] = "ESC"),
          $s
        );
        var e;
      })();
      let vB = (() => {
          class e {
            constructor(t, i, r) {
              (this._document = t),
                (this._elRef = i),
                (this._zone = r),
                (this._closed$ = new Ae()),
                (this._elWithFocus = null),
                (this.backdrop = !0),
                (this.keyboard = !0),
                (this.dismissEvent = new U()),
                (this.shown = new Ae()),
                (this.hidden = new Ae());
            }
            dismiss(t) {
              this.dismissEvent.emit(t);
            }
            ngOnInit() {
              (this._elWithFocus = this._document.activeElement),
                this._zone.onStable
                  .asObservable()
                  .pipe(at(1))
                  .subscribe(() => {
                    this._show();
                  });
            }
            ngOnDestroy() {
              this._disableEventHandling();
            }
            hide() {
              const { nativeElement: t } = this._elRef,
                i = { animation: this.animation, runningTransition: "stop" },
                s = Ll(
                  Nt(this._zone, t, () => t.classList.remove("show"), i),
                  Nt(this._zone, this._dialogEl.nativeElement, () => {}, i)
                );
              return (
                s.subscribe(() => {
                  this.hidden.next(), this.hidden.complete();
                }),
                this._disableEventHandling(),
                this._restoreFocus(),
                s
              );
            }
            _show() {
              const t = {
                animation: this.animation,
                runningTransition: "continue",
              };
              Ll(
                Nt(
                  this._zone,
                  this._elRef.nativeElement,
                  (o, s) => {
                    s && fo(o), o.classList.add("show");
                  },
                  t
                ),
                Nt(this._zone, this._dialogEl.nativeElement, () => {}, t)
              ).subscribe(() => {
                this.shown.next(), this.shown.complete();
              }),
                this._enableEventHandling(),
                this._setFocus();
            }
            _enableEventHandling() {
              const { nativeElement: t } = this._elRef;
              this._zone.runOutsideAngular(() => {
                wt(t, "keydown")
                  .pipe(
                    Ze(this._closed$),
                    Ut((r) => r.which === Qe.Escape)
                  )
                  .subscribe((r) => {
                    this.keyboard
                      ? requestAnimationFrame(() => {
                          r.defaultPrevented ||
                            this._zone.run(() => this.dismiss($s.ESC));
                        })
                      : "static" === this.backdrop && this._bumpBackdrop();
                  });
                let i = !1;
                wt(this._dialogEl.nativeElement, "mousedown")
                  .pipe(
                    Ze(this._closed$),
                    Ct(() => (i = !1)),
                    ri(() => wt(t, "mouseup").pipe(Ze(this._closed$), at(1))),
                    Ut(({ target: r }) => t === r)
                  )
                  .subscribe(() => {
                    i = !0;
                  }),
                  wt(t, "click")
                    .pipe(Ze(this._closed$))
                    .subscribe(({ target: r }) => {
                      t === r &&
                        ("static" === this.backdrop
                          ? this._bumpBackdrop()
                          : !0 === this.backdrop &&
                            !i &&
                            this._zone.run(() =>
                              this.dismiss($s.BACKDROP_CLICK)
                            )),
                        (i = !1);
                    });
              });
            }
            _disableEventHandling() {
              this._closed$.next();
            }
            _setFocus() {
              const { nativeElement: t } = this._elRef;
              if (!t.contains(document.activeElement)) {
                const i = t.querySelector("[ngbAutofocus]"),
                  r = TD(t)[0];
                (i || r || t).focus();
              }
            }
            _restoreFocus() {
              const t = this._document.body,
                i = this._elWithFocus;
              let r;
              (r = i && i.focus && t.contains(i) ? i : t),
                this._zone.runOutsideAngular(() => {
                  setTimeout(() => r.focus()), (this._elWithFocus = null);
                });
            }
            _bumpBackdrop() {
              "static" === this.backdrop &&
                Nt(
                  this._zone,
                  this._elRef.nativeElement,
                  ({ classList: t }) => (
                    t.add("modal-static"), () => t.remove("modal-static")
                  ),
                  { animation: this.animation, runningTransition: "continue" }
                );
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(_(nt), _(_e), _(we));
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["ngb-modal-window"]],
              viewQuery: function (t, i) {
                if ((1 & t && kd(SV, 7), 2 & t)) {
                  let r;
                  Me(
                    (r = (function Te() {
                      return (function aI(e, n) {
                        return e[19].queries[n].queryList;
                      })(b(), Fp());
                    })())
                  ) && (i._dialogEl = r.first);
                }
              },
              hostAttrs: ["role", "dialog", "tabindex", "-1"],
              hostVars: 7,
              hostBindings: function (t, i) {
                2 & t &&
                  (ae("aria-modal", !0)("aria-labelledby", i.ariaLabelledBy)(
                    "aria-describedby",
                    i.ariaDescribedBy
                  ),
                  $i(
                    "modal d-block" + (i.windowClass ? " " + i.windowClass : "")
                  ),
                  Ne("fade", i.animation));
              },
              inputs: {
                animation: "animation",
                ariaLabelledBy: "ariaLabelledBy",
                ariaDescribedBy: "ariaDescribedBy",
                backdrop: "backdrop",
                centered: "centered",
                keyboard: "keyboard",
                scrollable: "scrollable",
                size: "size",
                windowClass: "windowClass",
                modalDialogClass: "modalDialogClass",
              },
              outputs: { dismissEvent: "dismiss" },
              ngContentSelectors: lD,
              decls: 4,
              vars: 2,
              consts: [
                ["role", "document"],
                ["dialog", ""],
                [1, "modal-content"],
              ],
              template: function (t, i) {
                1 & t && (fd(), A(0, "div", 0, 1)(2, "div", 2), hd(3), O()()),
                  2 & t &&
                    $i(
                      "modal-dialog" +
                        (i.size ? " modal-" + i.size : "") +
                        (i.centered ? " modal-dialog-centered" : "") +
                        (i.scrollable ? " modal-dialog-scrollable" : "") +
                        (i.modalDialogClass ? " " + i.modalDialogClass : "")
                    );
              },
              styles: [
                "ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n",
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        yB = (() => {
          class e {
            constructor(t) {
              this._document = t;
            }
            hide() {
              const t = Math.abs(
                  window.innerWidth - this._document.documentElement.clientWidth
                ),
                i = this._document.body,
                r = i.style,
                { overflow: o, paddingRight: s } = r;
              if (t > 0) {
                const a = parseFloat(window.getComputedStyle(i).paddingRight);
                r.paddingRight = `${a + t}px`;
              }
              return (
                (r.overflow = "hidden"),
                () => {
                  t > 0 && (r.paddingRight = s), (r.overflow = o);
                }
              );
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(nt));
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        bB = (() => {
          class e {
            constructor(t, i, r, o, s, a) {
              (this._applicationRef = t),
                (this._injector = i),
                (this._document = r),
                (this._scrollBar = o),
                (this._rendererFactory = s),
                (this._ngZone = a),
                (this._activeWindowCmptHasChanged = new Ae()),
                (this._ariaHiddenValues = new Map()),
                (this._backdropAttributes = ["animation", "backdropClass"]),
                (this._modalRefs = []),
                (this._windowAttributes = [
                  "animation",
                  "ariaLabelledBy",
                  "ariaDescribedBy",
                  "backdrop",
                  "centered",
                  "keyboard",
                  "scrollable",
                  "size",
                  "windowClass",
                  "modalDialogClass",
                ]),
                (this._windowCmpts = []),
                (this._activeInstances = new U()),
                this._activeWindowCmptHasChanged.subscribe(() => {
                  if (this._windowCmpts.length) {
                    const l = this._windowCmpts[this._windowCmpts.length - 1];
                    ((e, n, t, i = !1) => {
                      this._ngZone.runOutsideAngular(() => {
                        const r = wt(n, "focusin").pipe(
                          Ze(t),
                          K((o) => o.target)
                        );
                        wt(n, "keydown")
                          .pipe(
                            Ze(t),
                            Ut((o) => o.which === Qe.Tab),
                            Zf(r)
                          )
                          .subscribe(([o, s]) => {
                            const [a, l] = TD(n);
                            (s === a || s === n) &&
                              o.shiftKey &&
                              (l.focus(), o.preventDefault()),
                              s === l &&
                                !o.shiftKey &&
                                (a.focus(), o.preventDefault());
                          }),
                          i &&
                            wt(n, "click")
                              .pipe(
                                Ze(t),
                                Zf(r),
                                K((o) => o[1])
                              )
                              .subscribe((o) => o.focus());
                      });
                    })(
                      0,
                      l.location.nativeElement,
                      this._activeWindowCmptHasChanged
                    ),
                      this._revertAriaHidden(),
                      this._setAriaHidden(l.location.nativeElement);
                  }
                });
            }
            open(t, i, r, o) {
              const s =
                  o.container instanceof HTMLElement
                    ? o.container
                    : er(o.container)
                    ? this._document.querySelector(o.container)
                    : this._document.body,
                a = this._rendererFactory.createRenderer(null, null),
                l = this._scrollBar.hide(),
                u = () => {
                  this._modalRefs.length ||
                    (a.removeClass(this._document.body, "modal-open"),
                    this._revertAriaHidden());
                };
              if (!s)
                throw new Error(
                  `The specified modal container "${
                    o.container || "body"
                  }" was not found in the DOM.`
                );
              const c = new BD(),
                d = this._getContentRef(t, o.injector || i, r, c, o);
              let f = !1 !== o.backdrop ? this._attachBackdrop(t, s) : void 0,
                h = this._attachWindowComponent(t, s, d),
                p = new _B(h, d, f, o.beforeDismiss);
              return (
                this._registerModalRef(p),
                this._registerWindowCmpt(h),
                p.result.then(l, l),
                p.result.then(u, u),
                (c.close = (g) => {
                  p.close(g);
                }),
                (c.dismiss = (g) => {
                  p.dismiss(g);
                }),
                this._applyWindowOptions(h.instance, o),
                1 === this._modalRefs.length &&
                  a.addClass(this._document.body, "modal-open"),
                f &&
                  f.instance &&
                  (this._applyBackdropOptions(f.instance, o),
                  f.changeDetectorRef.detectChanges()),
                h.changeDetectorRef.detectChanges(),
                p
              );
            }
            get activeInstances() {
              return this._activeInstances;
            }
            dismissAll(t) {
              this._modalRefs.forEach((i) => i.dismiss(t));
            }
            hasOpenModals() {
              return this._modalRefs.length > 0;
            }
            _attachBackdrop(t, i) {
              let o = t.resolveComponentFactory(mB).create(this._injector);
              return (
                this._applicationRef.attachView(o.hostView),
                i.appendChild(o.location.nativeElement),
                o
              );
            }
            _attachWindowComponent(t, i, r) {
              let s = t
                .resolveComponentFactory(vB)
                .create(this._injector, r.nodes);
              return (
                this._applicationRef.attachView(s.hostView),
                i.appendChild(s.location.nativeElement),
                s
              );
            }
            _applyWindowOptions(t, i) {
              this._windowAttributes.forEach((r) => {
                er(i[r]) && (t[r] = i[r]);
              });
            }
            _applyBackdropOptions(t, i) {
              this._backdropAttributes.forEach((r) => {
                er(i[r]) && (t[r] = i[r]);
              });
            }
            _getContentRef(t, i, r, o, s) {
              return r
                ? r instanceof xe
                  ? this._createFromTemplateRef(r, o)
                  : (function cD(e) {
                      return "string" == typeof e;
                    })(r)
                  ? this._createFromString(r)
                  : this._createFromComponent(t, i, r, o, s)
                : new rr([]);
            }
            _createFromTemplateRef(t, i) {
              const o = t.createEmbeddedView({
                $implicit: i,
                close(s) {
                  i.close(s);
                },
                dismiss(s) {
                  i.dismiss(s);
                },
              });
              return (
                this._applicationRef.attachView(o), new rr([o.rootNodes], o)
              );
            }
            _createFromString(t) {
              const i = this._document.createTextNode(`${t}`);
              return new rr([[i]]);
            }
            _createFromComponent(t, i, r, o, s) {
              const a = t.resolveComponentFactory(r),
                l = et.create({
                  providers: [{ provide: BD, useValue: o }],
                  parent: i,
                }),
                u = a.create(l),
                c = u.location.nativeElement;
              return (
                s.scrollable && c.classList.add("component-host-scrollable"),
                this._applicationRef.attachView(u.hostView),
                new rr([[c]], u.hostView, u)
              );
            }
            _setAriaHidden(t) {
              const i = t.parentElement;
              i &&
                t !== this._document.body &&
                (Array.from(i.children).forEach((r) => {
                  r !== t &&
                    "SCRIPT" !== r.nodeName &&
                    (this._ariaHiddenValues.set(
                      r,
                      r.getAttribute("aria-hidden")
                    ),
                    r.setAttribute("aria-hidden", "true"));
                }),
                this._setAriaHidden(i));
            }
            _revertAriaHidden() {
              this._ariaHiddenValues.forEach((t, i) => {
                t
                  ? i.setAttribute("aria-hidden", t)
                  : i.removeAttribute("aria-hidden");
              }),
                this._ariaHiddenValues.clear();
            }
            _registerModalRef(t) {
              const i = () => {
                const r = this._modalRefs.indexOf(t);
                r > -1 &&
                  (this._modalRefs.splice(r, 1),
                  this._activeInstances.emit(this._modalRefs));
              };
              this._modalRefs.push(t),
                this._activeInstances.emit(this._modalRefs),
                t.result.then(i, i);
            }
            _registerWindowCmpt(t) {
              this._windowCmpts.push(t),
                this._activeWindowCmptHasChanged.next(),
                t.onDestroy(() => {
                  const i = this._windowCmpts.indexOf(t);
                  i > -1 &&
                    (this._windowCmpts.splice(i, 1),
                    this._activeWindowCmptHasChanged.next());
                });
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(tl), T(et), T(nt), T(yB), T(Cd), T(we));
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        DB = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t), (this.backdrop = !0), (this.keyboard = !0);
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(Kl));
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        CB = (() => {
          class e {
            constructor(t, i, r, o) {
              (this._moduleCFR = t),
                (this._injector = i),
                (this._modalStack = r),
                (this._config = o);
            }
            open(t, i = {}) {
              const r = Object.assign(
                Object.assign(Object.assign({}, this._config), {
                  animation: this._config.animation,
                }),
                i
              );
              return this._modalStack.open(
                this._moduleCFR,
                this._injector,
                t,
                r
              );
            }
            get activeInstances() {
              return this._modalStack.activeInstances;
            }
            dismissAll(t) {
              this._modalStack.dismissAll(t);
            }
            hasOpenModals() {
              return this._modalStack.hasOpenModals();
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(T(qr), T(et), T(bB), T(DB));
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        jD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ providers: [CB] })),
            e
          );
        })(),
        GD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        KD = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        eC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        xB = (() => {
          class e {
            constructor() {
              (this.max = 100),
                (this.animated = !1),
                (this.striped = !1),
                (this.showValue = !1);
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??prov = x({ token: e, factory: e.??fac, providedIn: "root" })),
            e
          );
        })(),
        PB = (() => {
          class e {
            constructor(t) {
              (this.value = 0),
                (this.max = t.max),
                (this.animated = t.animated),
                (this.striped = t.striped),
                (this.textType = t.textType),
                (this.type = t.type),
                (this.showValue = t.showValue),
                (this.height = t.height);
            }
            set max(t) {
              this._max = !jn(t) || t <= 0 ? 100 : t;
            }
            get max() {
              return this._max;
            }
            getValue() {
              return (function uD(e, n, t = 0) {
                return Math.max(Math.min(e, n), t);
              })(this.value, this.max);
            }
            getPercentValue() {
              return (100 * this.getValue()) / this.max;
            }
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)(_(xB));
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["ngb-progressbar"]],
              hostAttrs: [1, "progress"],
              hostVars: 2,
              hostBindings: function (t, i) {
                2 & t && qo("height", i.height);
              },
              inputs: {
                max: "max",
                animated: "animated",
                striped: "striped",
                showValue: "showValue",
                textType: "textType",
                type: "type",
                value: "value",
                height: "height",
              },
              ngContentSelectors: lD,
              decls: 3,
              vars: 11,
              consts: function () {
                let n;
                return (
                  (n = $localize`:@@ngb.progressbar.value:${"\ufffd0\ufffd"}:INTERPOLATION:`),
                  [
                    ["role", "progressbar", "aria-valuemin", "0"],
                    [4, "ngIf"],
                    n,
                  ]
                );
              },
              template: function (t, i) {
                1 & t &&
                  (fd(),
                  A(0, "div", 0),
                  (function z(e, n, t, i, r, o, s, a) {
                    const l = b(),
                      u = ee(),
                      c = e + 20,
                      d = u.firstCreatePass
                        ? (function mT(e, n, t, i, r, o, s, a, l) {
                            const u = n.consts,
                              c = Ar(n, e, 4, s || null, pi(u, a));
                            Hc(n, t, c, pi(u, l)), ca(n, c);
                            const d = (c.tViews = Pa(
                              2,
                              c,
                              i,
                              r,
                              o,
                              n.directiveRegistry,
                              n.pipeRegistry,
                              null,
                              n.schemas,
                              u
                            ));
                            return (
                              null !== n.queries &&
                                (n.queries.template(n, c),
                                (d.queries = n.queries.embeddedTView(c))),
                              c
                            );
                          })(c, u, l, n, t, i, r, o, s)
                        : u.data[c];
                    Tn(d, !1);
                    const f = l[H].createComment("");
                    Aa(u, l, f, d),
                      dt(f, l),
                      ka(l, (l[c] = Tm(f, l, f, d))),
                      ra(d) && Bc(u, l, d),
                      null != s && jc(l, d, a);
                  })(1, u2, 3, 3, "span", 1),
                  hd(2),
                  O()),
                  2 & t &&
                    ((function K_(e, n, t, i, r, o, s, a, l) {
                      hn(Ft, Pn, Br(b(), e, n, t, i, r, o, s, a, l), !0);
                    })(
                      "progress-bar",
                      i.type ? " bg-" + i.type : "",
                      "",
                      i.textType ? " text-" + i.textType : "",
                      "\n    ",
                      i.animated ? " progress-bar-animated" : "",
                      "",
                      i.striped ? " progress-bar-striped" : "",
                      ""
                    ),
                    qo("width", i.getPercentValue(), "%"),
                    ae("aria-valuenow", i.getValue())("aria-valuemax", i.max),
                    S(1),
                    Y("ngIf", i.showValue));
              },
              directives: [Xr],
              pipes: [c0],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        tC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        nC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        iC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        rC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({ imports: [[$t]] })),
            e
          );
        })(),
        oC = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({})),
            e
          );
        })();
      new W("live announcer delay", {
        providedIn: "root",
        factory: function LB() {
          return 100;
        },
      });
      let sC = (() => {
        class e {}
        return (
          (e.??fac = function (t) {
            return new (t || e)();
          }),
          (e.??mod = ce({ type: e })),
          (e.??inj = se({ imports: [[$t]] })),
          e
        );
      })();
      const VB = [
        _D,
        vD,
        bD,
        wD,
        ED,
        kD,
        VD,
        jD,
        GD,
        KD,
        eC,
        tC,
        nC,
        iC,
        rC,
        oC,
        sC,
      ];
      let BB = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e })),
            (e.??inj = se({
              imports: [
                VB,
                _D,
                vD,
                bD,
                wD,
                ED,
                kD,
                VD,
                jD,
                GD,
                KD,
                eC,
                tC,
                nC,
                iC,
                rC,
                oC,
                sC,
              ],
            })),
            e
          );
        })(),
        jB = (() => {
          class e {
            constructor() {
              (this.linkedin =
                "https://www.linkedin.com/in/vladislav-batura-b1277521a/"),
                (this.facebook = "https://www.facebook.com/VladAviat0r/"),
                (this.github = "https://github.com/VladislavBatura"),
                (this.telegram = "https://t.me/Aviat0r"),
                (this.home = "http://localhost:4200");
            }
            ngOnInit() {}
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["app-header"]],
              decls: 11,
              vars: 5,
              consts: [
                [1, "navbar"],
                [3, "href"],
                [1, "right", 3, "href"],
              ],
              template: function (t, i) {
                1 & t &&
                  (A(0, "div", 0)(1, "a", 1),
                  Ue(2, "Vladislav Batura"),
                  O(),
                  A(3, "a", 2),
                  Ue(4, "Telegram"),
                  O(),
                  A(5, "a", 2),
                  Ue(6, "Github"),
                  O(),
                  A(7, "a", 2),
                  Ue(8, "Linkedin"),
                  O(),
                  A(9, "a", 2),
                  Ue(10, "Facebook"),
                  O()()),
                  2 & t &&
                    (S(1),
                    jt("href", i.home, Lt),
                    S(2),
                    jt("href", i.telegram, Lt),
                    S(2),
                    jt("href", i.github, Lt),
                    S(2),
                    jt("href", i.linkedin, Lt),
                    S(2),
                    jt("href", i.facebook, Lt));
              },
              directives: [Lh],
              styles: [
                '@import"https://fonts.googleapis.com/css2?family=VT323&display=swap";.navbar[_ngcontent-%COMP%]{overflow:hidden;background-color:#4e298b;position:sticky;position:-webkit-sticky;top:0}.navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{float:left;display:block;color:#fff;text-align:center;padding:8px 10px;text-decoration:none;font-size:24px;font-family:VT323,monospace}.navbar[_ngcontent-%COMP%]   a.right[_ngcontent-%COMP%]{float:right}.navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#ddd;color:#000}',
              ],
            })),
            e
          );
        })(),
        HB = (() => {
          class e {
            constructor() {
              (this.cSharpImage = "assets/images/CSharp.png"),
                (this.jsImage = "assets/images/JS.png"),
                (this.angularImage = "assets/images/Angular.png"),
                (this.postgreImage = "assets/images/PostgreSQL.png"),
                (this.cSharp = 80),
                (this.js = 50),
                (this.angular = 40),
                (this.postgre = 70);
            }
            ngOnInit() {}
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["app-skills"]],
              decls: 20,
              vars: 24,
              consts: [
                ["alt", "charp", 3, "src"],
                [
                  "type",
                  "primary",
                  "height",
                  "30px",
                  1,
                  "child",
                  "prog",
                  3,
                  "showValue",
                  "value",
                  "animated",
                ],
                ["alt", "js", 1, "child", 3, "src"],
                [
                  "type",
                  "warning",
                  "height",
                  "30px",
                  1,
                  "child",
                  "prog",
                  3,
                  "showValue",
                  "value",
                  "striped",
                  "animated",
                ],
                ["alt", "angular", 3, "src"],
                [
                  "type",
                  "danger",
                  "height",
                  "30px",
                  1,
                  "child",
                  "prog",
                  3,
                  "showValue",
                  "value",
                ],
                ["alt", "postgre", 3, "src"],
                [
                  "type",
                  "info",
                  "height",
                  "30px",
                  1,
                  "child",
                  "prog",
                  3,
                  "showValue",
                  "value",
                  "animated",
                ],
              ],
              template: function (t, i) {
                1 & t &&
                  (A(0, "p"),
                  At(1, "img", 0),
                  A(2, "ngb-progressbar", 1)(3, "div"),
                  Ue(4),
                  O()()(),
                  A(5, "p"),
                  At(6, "img", 2),
                  A(7, "ngb-progressbar", 3)(8, "div"),
                  Ue(9),
                  O()()(),
                  A(10, "p"),
                  At(11, "img", 4),
                  A(12, "ngb-progressbar", 5)(13, "div"),
                  Ue(14),
                  O()()(),
                  A(15, "p"),
                  At(16, "img", 6),
                  A(17, "ngb-progressbar", 7)(18, "div"),
                  Ue(19),
                  O()()()),
                  2 & t &&
                    (S(1),
                    jt("src", i.cSharpImage, Lt),
                    S(1),
                    Y("showValue", !0)("value", i.cSharp)("showValue", !1)(
                      "animated",
                      !0
                    ),
                    S(2),
                    Ht(" ", i.cSharp, "% "),
                    S(2),
                    jt("src", i.jsImage, Lt),
                    S(1),
                    Y("showValue", !0)("value", i.js)("showValue", !1)(
                      "striped",
                      !0
                    )("animated", !0),
                    S(2),
                    Ht(" ", i.js, "% "),
                    S(2),
                    jt("src", i.angularImage, Lt),
                    S(1),
                    Y("showValue", !0)("value", i.angular)("showValue", !1),
                    S(2),
                    Ht(" ", i.angular, "% "),
                    S(2),
                    jt("src", i.postgreImage, Lt),
                    S(1),
                    Y("showValue", !0)("value", i.postgre)("showValue", !1)(
                      "animated",
                      !0
                    ),
                    S(2),
                    Ht(" ", i.postgre, "% "));
              },
              directives: [PB],
              styles: [
                "div[_ngcontent-%COMP%]{font-size:24px}p[_ngcontent-%COMP%]{white-space:nowrap;position:relative}p[_ngcontent-%COMP%]   .child[_ngcontent-%COMP%]{display:inline-block}p[_ngcontent-%COMP%]   .prog[_ngcontent-%COMP%]{width:700px;position:absolute;top:50%;transform:translateY(-50%);margin-left:3%}",
              ],
            })),
            e
          );
        })(),
        $B = (() => {
          class e {
            constructor() {
              (this.anketnikImage = "assets/images/Anketnik.PNG"),
                (this.anketnikInfo =
                  "This is Anketnik. Simple WebForms application for access database and operate with it.\n   It provides a simple, but powerfull functionalities - update, view and delete ankets.\n    Anketnik was built exclusive for a server of Minecraft to use by me, and my friends, to sort new players and interview them with comfort for ourselves.");
            }
            ngOnInit() {}
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["app-projects"]],
              decls: 4,
              vars: 2,
              consts: [
                ["alt", "Anketnik", 3, "src"],
                [1, "child"],
              ],
              template: function (t, i) {
                1 & t &&
                  (A(0, "div"), At(1, "img", 0), A(2, "p", 1), Ue(3), O()()),
                  2 & t &&
                    (S(1),
                    jt("src", i.anketnikImage, Lt),
                    S(2),
                    Ht(" ", i.anketnikInfo, " "));
              },
              styles: [
                "img[_ngcontent-%COMP%]{max-width:40%;position:absolute;top:0%;left:3%}div[_ngcontent-%COMP%]{position:relative}div[_ngcontent-%COMP%]   .child[_ngcontent-%COMP%]{display:inline-block;white-space:initial;max-width:40%;margin:0% 5% 5% 50%}",
              ],
            })),
            e
          );
        })(),
        UB = (() => {
          class e {
            constructor() {
              (this.creator = "Vladislav Batura"),
                (this.email = "batura.vlad@gmail.com"),
                (this.year = 2022);
            }
            ngOnInit() {}
          }
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["app-footer"]],
              decls: 7,
              vars: 3,
              template: function (t, i) {
                1 & t &&
                  (A(0, "footer")(1, "p"),
                  Ue(2),
                  O(),
                  A(3, "p"),
                  Ue(4),
                  O(),
                  A(5, "p"),
                  Ue(6),
                  O()()),
                  2 & t &&
                    (S(2),
                    Ht(" ", i.creator, " "),
                    S(2),
                    Ht(" Email: ", i.email, " "),
                    S(2),
                    Ht(" ", i.year, " "));
              },
              styles: [
                "footer[_ngcontent-%COMP%]{background-color:#180d2b;padding:0 0 5px}p[_ngcontent-%COMP%]{text-align:center}",
              ],
            })),
            e
          );
        })(),
        GB = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??cmp = gt({
              type: e,
              selectors: [["my-app"]],
              decls: 14,
              vars: 0,
              consts: [
                [1, "background"],
                [1, "container"],
                [1, "skillsDiv"],
                [1, "container", "secondContainer"],
                [1, "projectDiv"],
              ],
              template: function (t, i) {
                1 & t &&
                  (A(0, "div", 0)(1, "div"),
                  At(2, "app-header"),
                  O(),
                  A(3, "section", 1)(4, "h2"),
                  Ue(5, "Software Developer"),
                  O()(),
                  A(6, "div", 2),
                  At(7, "app-skills"),
                  O(),
                  A(8, "section", 3)(9, "h2"),
                  Ue(10, "Projects"),
                  O()(),
                  A(11, "div", 4),
                  At(12, "app-projects"),
                  O()(),
                  At(13, "app-footer"));
              },
              directives: [jB, HB, $B, UB],
              styles: [
                '@import"https://fonts.googleapis.com/css2?family=VT323&display=swap";*[_ngcontent-%COMP%]{font-family:VT323,monospace;font-size:24px;color:#fff}h2[_ngcontent-%COMP%]{font-size:72px}.background[_ngcontent-%COMP%]{background-color:#4e298b}.container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;height:600px;padding:0;background-image:url(BackgroundImageCoding2.e199c5303ed0486a.png);background-size:cover;background-repeat:no-repeat}.secondContainer[_ngcontent-%COMP%]{background-image:url(BackgroundSpaceProjects.fc097eeab15c303e.png)}.skillsDiv[_ngcontent-%COMP%]{padding:0% 25%}.projectDiv[_ngcontent-%COMP%]{margin:5% 5% 0%}',
              ],
            })),
            e
          );
        })(),
        WB = (() => {
          class e {}
          return (
            (e.??fac = function (t) {
              return new (t || e)();
            }),
            (e.??mod = ce({ type: e, bootstrap: [GB] })),
            (e.??inj = se({ providers: [], imports: [[sx, Fk, BB]] })),
            e
          );
        })();
      (function GI() {
        ky = !1;
      })(),
        rx()
          .bootstrapModule(WB)
          .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 435));
  },
]);
