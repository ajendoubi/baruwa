%if ! (0%{?fedora} > 12 || 0%{?rhel} > 5)
%{!?python_sitelib: %global python_sitelib %(%{__python} -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")}
%endif
%{!?pyver: %global pyver %(%{__python} -c "import sys ; print sys.version[:3]")}

Name:           baruwa
Version:        1.1.0
Release:        1%{?dist}
Summary:        Ajax enabled MailScanner web frontend      
Group:          Applications/Internet
License:        GPLv2
URL:            http://www.baruwa.org/
Source0:        http://pypi.python.org/packages/source/b/baruwa/%{name}-%{version}.tar.gz
Source1:        baruwa.httpd
Source2:        baruwa.cron
Source3:        baruwa.mailscanner
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArch:      noarch
BuildRequires:  python-devel
BuildRequires:  python-setuptools
BuildRequires:  python-sphinx
Requires:       Django >= 1.2
Requires:       python-GeoIP
Requires:       python-IPy
Requires:       python-reportlab
Requires:       python-lxml
%if pyver < 2.5
Requires:       python-uuid
%endif
Requires:       MySQL-python >= 1.2.2
Requires:       httpd
Requires:       dojo
Requires:       mailscanner

%description
Baruwa (swahili for letter or mail) is a web 2.0 MailScanner
front-end. 

It provides an easy to use interface for managing a MailScanner
installation. It is used to perform operations such as releasing
quarantined messages, spam learning, whitelisting and 
blacklisting addresses, monitoring the health of the services etc. 
Baruwa is implemented using web 2.0 features (AJAX) where deemed 
fit, graphing is also implemented on the client side using SVG, 
Silverlight or VML. Baruwa has full support for i18n, letting you
support any language of your choosing.

It includes reporting functionality with an easy to use query 
builder, results can be displayed as message lists or graphed
as colorful and pretty interactive graphs.

Custom MailScanner modules are provided to allow for logging of 
messages to the mysql database with SQLite as backup, managing 
whitelists and blacklists and managing per user spam check 
settings.

%prep
%setup -q -n %{name}-%{version}

%build
%{__python} setup.py build
cd docs
mkdir -p build/html
mkdir -p source/_static
%{__make} html
%{__rm}  -rf build/html/.buildinf


%install
rm -rf $RPM_BUILD_ROOT
%{__python} setup.py install -O1 --skip-build --root $RPM_BUILD_ROOT
%{__chmod} 0755 $RPM_BUILD_ROOT%{python_sitelib}/%{name}/manage.py
%{__install} -d -p $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d
%{__install} -d -p $RPM_BUILD_ROOT%{_sysconfdir}/cron.daily
%{__install} -d -p $RPM_BUILD_ROOT%{_sysconfdir}/%{name}
%{__install} -d -p $RPM_BUILD_ROOT%{_sysconfdir}/%{name}/CustomFunctions
%{__install} -d -p $RPM_BUILD_ROOT%{_sysconfdir}/MailScanner/conf.d
%{__install} -p -m0644 extras/*.pm $RPM_BUILD_ROOT%{_sysconfdir}/%{name}/CustomFunctions
%{__install} -p -m0644 %SOURCE1 $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d/%{name}.conf
%{__install} -p -m0644 %SOURCE3 $RPM_BUILD_ROOT%{_sysconfdir}/MailScanner/conf.d/%{name}.conf
%{__install} -p -m0755 %SOURCE2 $RPM_BUILD_ROOT%{_sysconfdir}/cron.daily/%{name}
%{__install} -p -m0633 src/baruwa/settings.py $RPM_BUILD_ROOT%{_sysconfdir}/%{name}/settings.py
pushd $RPM_BUILD_ROOT%{python_sitelib}/%{name}/static/js
ln -s ../../../../../../share/dojo/dojo .
ln -s ../../../../../../share/dojo/dojox .
ln -s ../../../../../../share/dojo/dijit .
popd 
%clean
rm -rf $RPM_BUILD_ROOT


%files
%defattr(-,root,root,-)
%doc AUTHORS LICENSE README ROADMAP.md UPGRADE docs/build/html docs/source
%config(noreplace) %{_sysconfdir}/%{name}/settings.py
%config(noreplace) %{_sysconfdir}/httpd/conf.d/%{name}.conf
%config(noreplace) %{_sysconfdir}/MailScanner/conf.d/%{name}.conf
%{_sysconfdir}/cron.daily/%{name}
%{_sysconfdir}/%{name}/
%{python_sitelib}/*


%changelog
* Wed Apr 27 2011 Andrew Colin Kissa <andrew@topdog.za.net> - 1.1.0-1
- upgrade to latest version

* Sat Apr 23 2011 Andrew Colin Kissa <andrew@topdog.za.net> - 1.0.2-4
 - FIX: exchange duplicate delivery suppression blocks releases
 - FIX: some RBL names not being displayed

* Thu Apr 14 2011 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.2-3
- Fix mailauth exception

* Sat Feb 22 2011 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.2-2
- Fix CSRF protection issues preventing users of Django 1.x.x from
  performing Ajax POST operations.

* Sat Feb 19 2011 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.2-1
- upgrade to the latest version

* Mon Feb 06 2011 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.1-2
- fix the annotation regression introduced by django 1.2.4
- fix the js alert and redirection on the login page

* Wed Dec 29 2010 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.1-1
- upgrade to latest version

* Sun Nov 21 2010 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.0-3
- Various bug fixes

* Fri Oct 29 2010 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.0-2
- remove MySQL-python as dependency as installing from source

* Tue Oct 26 2010 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.0-1
- Upgrade to latest version

* Wed Jun 30 2010 Andrew Colin Kissa <andrew@topdog.za.net> 1.0.0-0.1.a
- Upgrade to latest version

* Tue May 11 2010 Andrew Colin Kissa <andrew@topdog.za.net> 0.0.1-0.3.rc1
- update to latest version

* Mon Apr 05 2010 Andrew Colin Kissa <andrew@topdog.za.net> 0.0.1-0.2.b
- update to latest version

* Fri Mar 26 2010 Andrew Colin Kissa <andrew@topdog.za.net> 0.0.1-0.1.a
- Initial packaging
