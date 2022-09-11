import MediaInfo from '../core/media-info'

/**
 * 解析flv头部tag数据
 */
interface ProbeData {
  match: boolean
  consumed?: number
  dataOffset?: number
  hasAudioTrack?: boolean
  hasVideoTrack?: boolean
}


function ReadBig32(array: Uint8Array, index: number) {
  return ((array[index] << 24) |
    (array[index + 1] << 16) |
    (array[index + 2] << 8) |
    (array[index + 3]));
}

class FlvDemuxer {
  TAG = 'FLVDemuxer'
  private _config: any;
  _onError: null;
  _onMediaInfo: null;
  _onMetaDataArrived: null;
  _onScriptDataArrived: null;
  _onTrackMetadata: null;
  _onDataAvailable: null;
  _dataOffset: any;
  _firstParse: boolean;
  _dispatch: boolean;
  _hasAudio: any;
  _hasVideo: any;
  _hasAudioFlagOverrided: boolean;
  _hasVideoFlagOverrided: boolean;
  _audioInitialMetadataDispatched: boolean;
  _videoInitialMetadataDispatched: boolean;
  _mediaInfo: any;
  _metadata: null;
  _audioMetadata: null;
  _videoMetadata: null;
  _naluLengthSize: number;
  _timestampBase: number;
  _timescale: number;
  _duration: number;
  _durationOverrided: boolean;
  _referenceFrameRate: { fixed: boolean; fps: number; fps_num: number; fps_den: number; };
  _flvSoundRateTable: number[];
  _mpegSamplingRates: number[];
  _mpegAudioV10SampleRateTable: number[];
  _mpegAudioV20SampleRateTable: number[];
  _mpegAudioV25SampleRateTable: number[];
  _mpegAudioL1BitRateTable: number[];
  _mpegAudioL2BitRateTable: number[];
  _mpegAudioL3BitRateTable: number[];
  _videoTrack: { type: string; id: number; sequenceNumber: number; samples: never[]; length: number; };
  _audioTrack: { type: string; id: number; sequenceNumber: number; samples: never[]; length: number; };
  _littleEndian: boolean;

  constructor(probeData: any, config: any) {
    this._config = config

    this._onError = null;
    this._onMediaInfo = null;
    this._onMetaDataArrived = null;
    this._onScriptDataArrived = null;
    this._onTrackMetadata = null;
    this._onDataAvailable = null;

    this._dataOffset = probeData.dataOffset;
    this._firstParse = true;
    this._dispatch = false;

    this._hasAudio = probeData.hasAudioTrack;
    this._hasVideo = probeData.hasVideoTrack;

    this._hasAudioFlagOverrided = false;
    this._hasVideoFlagOverrided = false;

    this._audioInitialMetadataDispatched = false;
    this._videoInitialMetadataDispatched = false;

    this._mediaInfo = new MediaInfo();
    this._mediaInfo.hasAudio = this._hasAudio;
    this._mediaInfo.hasVideo = this._hasVideo;
    this._metadata = null;
    this._audioMetadata = null;
    this._videoMetadata = null;

    this._naluLengthSize = 4;
    this._timestampBase = 0;  // int32, in milliseconds
    this._timescale = 1000;
    this._duration = 0;  // int32, in milliseconds
    this._durationOverrided = false;
    this._referenceFrameRate = {
      fixed: true,
      fps: 23.976,
      fps_num: 23976,
      fps_den: 1000
    };

    this._flvSoundRateTable = [5500, 11025, 22050, 44100, 48000];

    this._mpegSamplingRates = [
      96000, 88200, 64000, 48000, 44100, 32000,
      24000, 22050, 16000, 12000, 11025, 8000, 7350
    ];

    this._mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];
    this._mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];
    this._mpegAudioV25SampleRateTable = [11025, 12000, 8000, 0];

    this._mpegAudioL1BitRateTable = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1];
    this._mpegAudioL2BitRateTable = [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, -1];
    this._mpegAudioL3BitRateTable = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1];

    this._videoTrack = { type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0 };
    this._audioTrack = { type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0 };

    this._littleEndian = (function () {
      let buf = new ArrayBuffer(2);
      (new DataView(buf)).setInt16(0, 256, true);  // little-endian write
      return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE
    })();
  }


  static probe(buffer: ArrayBuffer) {

  }

}