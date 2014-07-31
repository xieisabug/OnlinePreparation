package com.xjy.op.util;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;

public class MyStrutsFilter implements Filter{
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		// 不过滤的url
		String url = request.getRequestURI();
		// if ("/hnfnuzyw/ueditor/jsp/imageUp.jsp".equals(url)) {
		if (url.contains("imageUp")) {
			System.out.println("使用自定义的过滤器");
			request.getRequestDispatcher("/WEB-INF/pages/ueditor/jsp/imageUp.jsp").forward(req,res);
		} else {
            chain.doFilter(req,res);
        }
	}

    @Override
    public void destroy() {

    }
}
