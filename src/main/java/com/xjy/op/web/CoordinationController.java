package com.xjy.op.web;

import com.xjy.op.dto.*;
import com.xjy.op.service.CoordinationService;
import com.xjy.op.service.DocumentService;
import com.xjy.op.service.FileService;
import com.xjy.op.service.SlideService;
import com.xjy.op.util.DiffMatchPatch;
import com.xjy.op.util.LimitQueue;
import com.xjy.op.web.command.TextCommand;
import com.xjy.op.web.command.UserChatCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.misc.IOUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

@Controller
public class CoordinationController {

    private int MAX_CHAT_HISTORY;

    @Autowired
    private CoordinationService coordinationService;
    @Autowired
    private DocumentService documentService;
    @Autowired
    private SlideService slideService;
    @Autowired
    private FileService fileService;

    //用于转发数据(sendTo)
    private SimpMessagingTemplate template;
    private Map<Integer, Object[]> coordinationCache = new HashMap<Integer, Object[]>();
    private DiffMatchPatch dmp = new DiffMatchPatch();//用来处理文件差异的合并等操作的工具

    @Autowired
    public CoordinationController(SimpMessagingTemplate t) {
        template = t;
    }

    /**
     * 用于进入某一个文档协同空间
     *
     * @param spaceId 协同空间ID
     * @param fileId  文件id
     * @param model   页面model对象
     * @return 跳转的页面
     */
    @RequestMapping(value = "/coordination/{spaceId}/{fileId}")
    public String jumpCoordination(@PathVariable int spaceId, @PathVariable int fileId, ModelMap model) {
        model.addAttribute("spaceId", spaceId);
        model.addAttribute("fileId", fileId);
        CoordinationDto coordinationDto = coordinationService.getCoordinationBySpaceIdAndFileId(spaceId, fileId);
        model.addAttribute("coordination", coordinationDto);
        return "coordination";
    }

    /**
     * 用于进入某一个演示文稿协同空间
     *
     * @param spaceId 协同空间ID
     * @param fileId  文件id
     * @param model   页面model对象
     * @return 跳转的页面
     */
    @RequestMapping(value = "/slide/{spaceId}/{fileId}")
    public String jumpSlide(@PathVariable int spaceId, @PathVariable int fileId, ModelMap model) {
        model.addAttribute("spaceId", spaceId);
        model.addAttribute("fileId", fileId);
        SlideDto slide = slideService.getSlideByFileId(fileId);
        CoordinationDto coordinationDto = coordinationService.getCoordinationBySpaceIdAndFileId(spaceId, fileId);
        model.addAttribute("slide",slide);
        model.addAttribute("coordination", coordinationDto);
        return "slide";
    }

    /**
     * WebSocket聊天的相应接收方法和转发方法
     *
     * @param userChat 关于用户聊天的各个信息
     */
    @MessageMapping("/userChat")
    public void userChat(UserChatCommand userChat) {
        //找到需要发送的地址
        String dest = "/userChat/chat" + userChat.getCoordinationId();
        //发送用户的聊天记录
        this.template.convertAndSend(dest, userChat);
        //获取缓存，并将用户最新的聊天记录存储到缓存中
        Object[] cache = coordinationCache.get(Integer.parseInt(userChat.getCoordinationId()));
        try {
            userChat.setName(URLDecoder.decode(userChat.getName(), "utf-8"));
            userChat.setChatContent(URLDecoder.decode(userChat.getChatContent(), "utf-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        ((LimitQueue<UserChatCommand>) cache[1]).offer(userChat);
    }

    /**
     * 接收的地址是/coordination/{coordinationId},需要制定协同空间的id
     * 发送的地址是/coordination/coordination+coordinationId，浏览器需要订阅这个地址才能接收到
     * @param delta 做的修改
     */
    @MessageMapping("/coordination/{coordinationId}")
    public void coordination(TextCommand delta, @DestinationVariable int coordinationId) {
        System.out.println(delta);
        String dest = "/coordination/coordination" + coordinationId;
        Object[] cache = coordinationCache.get(coordinationId);
        DocumentDto content = (DocumentDto) cache[0];
        LinkedList<DiffMatchPatch.Diff> diffs = dmp.diff_fromDelta(content.getContent(), delta.getDelta());
        LinkedList<DiffMatchPatch.Patch> patches = dmp.patch_make(content.getContent(), diffs);
        Object[] o = dmp.patch_apply(patches, content.getContent());
        content.setContent((String) o[0]);
        cache[0] = content;
        saveDocument(content);
//        System.out.println(o[0]);
        this.template.convertAndSend(dest, delta);
    }

    /**
     * 接收的地址是/slide/{coordinationId}/{slidePartId}/{slidePartIndex},需要指定协同空间的id，页面id，和当前编辑的是第几个
     * 发送的地址是/coordination/slide+coordinationId，浏览器需要订阅这个地址才能接收到
     * @param delta 做的修改
     */
    @MessageMapping("/slide/{coordinationId}/{slidePartId}/{slidePartIndex}")
    public void slideCoordination(TextCommand delta,@DestinationVariable int coordinationId,
                                  @DestinationVariable int slidePartId, @DestinationVariable int slidePartIndex) {
        System.out.println(delta);
        String dest = "/coordination/slide" + coordinationId;
        Object[] cache = coordinationCache.get(coordinationId);
        SlideDto slide = (SlideDto) cache[0];
        SlidePartDto slidePartDto = slide.getParts().get(slidePartIndex);
        LinkedList<DiffMatchPatch.Diff> diffs = dmp.diff_fromDelta(slidePartDto.getContent(), delta.getDelta());
        LinkedList<DiffMatchPatch.Patch> patches = dmp.patch_make(slidePartDto.getContent(), diffs);
        Object[] o = dmp.patch_apply(patches, slidePartDto.getContent());
        slidePartDto.setContent((String) o[0]);
        slide.getParts().set(slidePartIndex, slidePartDto);
//        cache[0] = content;
        saveSlide(slidePartDto);
        Map<String, Object> ret = new HashMap<String, Object>();
        ret.put("slidePartIndex", slidePartIndex);
        ret.put("slidePartId", slidePartId);
        ret.put("delta", delta);
//        System.out.println(o[0]);
        this.template.convertAndSend(dest, ret);
    }

    /**
     * 初始化，初始化文章和聊天记录
     *
     * @param coordinationId 协同空间的id
     */
    @SubscribeMapping("/initDocument/{coordinationId}/{fileId}")
    public Map<String,Object> initDocument(@DestinationVariable("coordinationId") int coordinationId, @DestinationVariable("fileId") int fileId) {
        System.out.println("------------新用户进入文档，协同空间初始化---------");
        Map<String, Object> document = new HashMap<String, Object>();
        CoordinationDto coordinationDto = coordinationService.getCoordinationById(coordinationId);
        DocumentDto documentDto;
        if (!coordinationCache.containsKey(coordinationDto.getId())) {//如果从来都没有进入过协同空间
            //初始化协同空间的缓存
            documentDto = documentService.getDocumentByFileId(fileId);
            coordinationCache.put(coordinationDto.getId(), new Object[]{documentDto, new LimitQueue<UserChatCommand>(MAX_CHAT_HISTORY)});
        } else {//否则
            //取出缓存，并且放入到网页中初始化
            documentDto = (DocumentDto) coordinationCache.get(coordinationDto.getId())[0];
        }
        document.put("document",documentDto);
        document.put("chat",coordinationCache.get(coordinationDto.getId())[1]);
        return document;
    }

    /**
     * 初始化，初始化演示文稿和聊天记录
     *
     * @param coordinationId 协同空间的id
     */
    @SubscribeMapping("/initSlide/{coordinationId}/{fileId}")
    public Map<String,Object> initSlide(@DestinationVariable("coordinationId") int coordinationId, @DestinationVariable("fileId") int fileId) {
        System.out.println("------------新用户进入演示文稿，协同空间初始化---------");
        Map<String, Object> slide = new HashMap<String, Object>();
        CoordinationDto coordinationDto = coordinationService.getCoordinationById(coordinationId);
        SlideDto slideDto;
        if (!coordinationCache.containsKey(coordinationDto.getId())) {//如果从来都没有进入过协同空间
            //初始化协同空间的缓存
            slideDto = slideService.getSlideByFileId(fileId);
            coordinationCache.put(coordinationDto.getId(), new Object[]{slideDto, new LimitQueue<UserChatCommand>(MAX_CHAT_HISTORY)});
        } else {//否则
            //取出缓存，并且放入到网页中初始化
            slideDto = (SlideDto) coordinationCache.get(coordinationDto.getId())[0];
        }
        slide.put("slide",slideDto);
        slide.put("chat",coordinationCache.get(coordinationDto.getId())[1]);
        return slide;
    }

    /**
     * 创建一个文档
     * @param name 创建文档的名称
     * @param spaceId 空间的id
     * @return 创建文档的相关信息
     */
    @RequestMapping(value="/createDocument/{spaceId}")
    @ResponseBody
    public Map<String,Object> createDocument(String name,@PathVariable int spaceId){
        int id = documentService.createDocument(name,spaceId);
        Map<String,Object> ret = new HashMap<String, Object>();
        ret.put("id",id);
        return ret;
    }

    /**
     * 创建一个演示文稿
     * @param name 创建演示文稿的名称
     * @param spaceId 空间的id
     * @return 创建演示文稿的相关信息
     */
    @RequestMapping(value="/createSlide/{spaceId}")
    @ResponseBody
    public Map<String,Object> createSlide(String name,@PathVariable int spaceId){
        int id = slideService.createSlide(name,spaceId);
        Map<String,Object> ret = new HashMap<String, Object>();
        ret.put("id",id);
        return ret;
    }

    /**
     * 创建演示文稿的一个页面
     * @param slideId 演示文稿的id
     */
    @RequestMapping(value="/createSlidePart/{coordinationId}/{slideId}", method= RequestMethod.POST)
    public void createSlidePart(@PathVariable int coordinationId, @PathVariable int slideId){
        String dest = "/coordination/slidePart"+coordinationId;
        System.out.println(dest);
        int id = slideService.createSlidePart(slideId);
        Object[] cache = coordinationCache.get(coordinationId);
        SlideDto slide = (SlideDto) cache[0];
        SlidePartDto slidePartDto = new SlidePartDto();
        slidePartDto.setId(id);
        slidePartDto.setContent("");
        slidePartDto.setSlideId(slideId);
        slide.getParts().add(slidePartDto);
        Map<String,Object> ret = new HashMap<String, Object>();
        ret.put("id",id);
        this.template.convertAndSend(dest, ret);
    }

    /**
     * 异步保存文档到数据库
     * @param documentDto 需要保存的文档
     */
    @Async
    public void saveDocument(DocumentDto documentDto){
        documentService.saveDocumentByFileId(documentDto.getFileId(), documentDto.getContent());
    }

    /**
     * 异步保存文档到数据库
     * @param slidePartDto 需要保存的演示文稿
     */
    @Async
    private void saveSlide(SlidePartDto slidePartDto) {
        slideService.saveSlidePart(slidePartDto);
    }

    /**
     * 基本的演示文稿演示
     * @param fileId 演示的文件id
     * @param model 页面存放演示文稿
     * @return 跳转的页面
     */
    @RequestMapping(value = "/basicSlideShow/{fileId}")
    public String basicSlideShow(@PathVariable("fileId") int fileId, ModelMap model){
        SlideDto slide = slideService.getSlideByFileId(fileId);
        FileDto file = fileService.getFileById(fileId);
        model.addAttribute("slide", slide);
        model.addAttribute("file", file);
        return "basicSlideShow";
    }

    public void setMAX_CHAT_HISTORY(int MAX_CHAT_HISTORY) {
        this.MAX_CHAT_HISTORY = MAX_CHAT_HISTORY;
    }
}