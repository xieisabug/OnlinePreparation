package com.xjy.op.util;

import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyDispatcherServlet extends DispatcherServlet {
    @Override
    protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 不过滤的url
        String url = request.getRequestURI();
        if (url.contains("imageUp")) {
            System.out.println("imageUp");
            response.sendRedirect("/WEB-INF/pages/ueditor/jsp/imageUp.jsp");
            return ;
        }
        super.doDispatch(request, response);
    }
}
